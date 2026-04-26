import { myPool } from '@database/pool.js';
import { DeAcaBadRequest, DeAcaInternal, DeAcaNotFound } from '@errors/response.errors.js';
import { PaginationOptions } from '@schemas/pagination.schema.js';
import { Pool, PoolClient } from 'pg';

interface DatosBase {
  nombre?: string;
  username?: string;
}

export abstract class BaseRepository<T extends DatosBase> {
  protected abstract readonly baseQuery: string;
  protected abstract readonly tableName: string;
  protected abstract readonly idName: string;
  protected abstract slugName?: string;

  protected executor: PoolClient | Pool = myPool;

  /**
   * Obtenemos una copia del repositorio, pero que usará el client recibido como parámetro.
   * Esto nos permite controlar la transacción desde afuera del repository
   * @param client
   * @returns this
   */
  public withTransaction(client: PoolClient): this {
    const instance = Object.create(Object.getPrototypeOf(this)); //Copiamos la instancia actual. No queremos cambiar la "original"
    Object.assign(instance, this); //Copiamos las propiedades
    instance.executor = client;
    return instance;
  }

  /**
   * Devuelve la cantidad de filas usando tableName. No usa la baseQuery
   * @param onlyActive
   * @returns
   */
  async getCount(onlyActive: boolean | undefined = undefined): Promise<number> {
    const params = [];
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    if (onlyActive !== undefined) {
      params.push(onlyActive);
      query += ' WHERE activo=$1';
    }
    const res = await this.executor.query(query, params);
    return parseInt(res.rows[0].total, 10);
  }

  /**
   * Devuelve todos los elementos encontrados. Sin paginación ni filtrado.
   * @returns
   */
  async getAll(): Promise<T[]> {
    return this.getBy();
  }

  /**
   *
   * @param filters permite agregar condiciones a la consulta.
   * @param pagination permite paginar.
   * @returns
   */
  async getBy(filters: Partial<T> = {}, pagination?: PaginationOptions): Promise<T[]> {
    const keys = Object.keys(filters);
    const values = Object.values(filters);

    // Construimos las condiciones solo si hay filtros
    let condiciones = '';
    if (keys.length > 0) {
      condiciones =
        ' AND ' +
        keys
          .map((key, index) => {
            const keySegura = key.replace(/[^a-zA-Z0-9_]/g, ''); //Borramos los caracteres que no son válidos en un nombre de columna.
            if (!keySegura) throw new DeAcaBadRequest('Clave de filtrado no válida'); //Si la linea anterior dejó un string vacío.
            return `"${keySegura}" = $${index + 1}`; //Entrecomillamos para que tome todo lo entrecomillado como el nombre de la columna.
          })
          .join(' AND ');
    }

    let query = `${this.baseQuery} ${condiciones}`;

    if (pagination?.limit && pagination?.page) {
      const direction = pagination?.orderDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; //Así safamos de codigo no deseado en order direction
      const sortField = pagination?.orderBy || this.idName;
      const safeSortField = sortField.replace(/[^a-zA-Z0-9_]/g, ''); //Eliminamos todos los caracteres que no son validos en un nombre de columna.
      query += ` ORDER BY "${safeSortField}" ${direction}`; //Entrecomillamos sortField para que lo tome como una columna y evitar código no deseado
      const limit = parseInt(pagination.limit.toString(), 10) || 10; //Me aseguro que limit no traiga codigo no deseado
      const page = parseInt(pagination.page.toString(), 10) || 1; //Me aseguro que page no traiga codigo no deseado
      const offset = (page - 1) * limit;
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);
    }

    const res = await this.executor.query(query, values);
    return res.rows as T[];
  }

  async getOneBy(filters: Partial<T>): Promise<T> {
    const keys = Object.keys(filters);
    if (keys.length === 0) throw new DeAcaBadRequest('No especificaste el filtro');
    const rows: T[] = await this.getBy(filters, { limit: 2, page: 1 }); //Pedimos 2 para que pueda fallar si viene más de una
    if (rows.length > 1)
      throw new DeAcaInternal('Se obtuvo más de un valor con ese filtro. Se esperaba uno.');

    if (rows.length === 0) {
      throw new DeAcaNotFound(`No existe registro con ${JSON.stringify(filters)}`);
    }
    return rows[0];
  }

  async add(data: Partial<T>): Promise<T> {
    if (this.slugName && this.slugName in data && data.nombre) {
      (data as any)[this.slugName] = this.createSlug(data.nombre as string);
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    const columnas = keys.join(', ');
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columnas}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;

    const res = await this.executor.query(query, values);
    //Sintaxis Computada [this.idName]: valor
    const filtro = { [this.idName]: res.rows[0][this.idName] } as Partial<T>;
    return this.getOneBy(filtro);
  }

  async remove(id: string | number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.idName} = $1`;
    const res = await this.executor.query(query, [id]);

    if (res.rowCount === 0) {
      throw new DeAcaNotFound(`No se encontró el registro con ${this.idName}: ${id} para eliminar.`);
    }
  }

  public async deactivate(id: string | number) {
    const query = `
      UPDATE ${this.tableName} 
      SET fecha_eliminacion=CURRENT_TIMESTAMP 
      WHERE ${this.idName} = $1 
      AND activo=true`;
    const res = await this.executor.query(query, [id]);

    if (res.rowCount === 0) {
      throw new DeAcaNotFound(`No se encontró el registro con ${this.idName}: ${id} activo para desactivar.`);
    }
  }

  public async activate(id: string | number) {
    const query = `
      UPDATE ${this.tableName} 
      SET fecha_eliminacion=null 
      WHERE ${this.idName} = $1 
      AND activo=false
    `;
    const res = await this.executor.query(query, [id]);

    if (res.rowCount === 0) {
      throw new DeAcaNotFound(`No se encontró el registro con ${this.idName}: ${id} inactivo para activar.`);
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<void> {
    //No se hace update de los idName, ni de activo, ni de slugs
    const keys = Object.keys(data).filter(
      (key) => key != this.idName && key != 'activo' && !key.startsWith('slug_'),
    ); //Los idName no se actualizan. //FIXME: Esto puede traer problemas
    if (keys.length === 0) throw new DeAcaBadRequest('No hay datos para actualizar');

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = keys.map((key) => (data as any)[key]); // 👈 importante

    const query = `
      UPDATE ${this.tableName} 
      SET ${sets} 
      WHERE ${this.idName} = $${keys.length + 1} 
      RETURNING *
    `;

    const res = await this.executor.query(query, [...values, id]);

    if (res.rows.length === 0) {
      throw new DeAcaNotFound(`No se pudo actualizar: registro con ${this.idName} ${id} no existe.`);
    }

    // const filtro = { [this.idName as string]: id } as Partial<T>;
    // return this.getOneBy(filtro);
  }

  async exists(id: string | number): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.tableName} WHERE ${this.idName} = $1`;
    const res = await this.executor.query(query, [id]);
    return res.rows.length === 1;
  }

  public createSlug(nombre: string): string {
    return nombre
      .toString()
      .normalize('NFD') // Separa acentos
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
      .toLowerCase()
      .replace(/\s+/g, '-') // Espacios por guiones
      .replace(/[^\w-]+/g, '') // Elimina todo lo que no sea letra, número o guion
      .replace(/--+/g, '-') // Evita guiones dobles
      .replace(/^-+/, '') // Quita guiones al inicio
      .replace(/-+$/, ''); // Quita guiones al final
  }
}
