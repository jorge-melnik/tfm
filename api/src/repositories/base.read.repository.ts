import { myPool } from '@database/pool.js';
import { DeAcaBadRequest, DeAcaInternal, DeAcaNotFound } from '@errors/response.errors.js';
import { PaginationOptions } from '@schemas/pagination.schema.js';
import { Pool, PoolClient } from 'pg';

interface DatosBase {
  nombre?: string;
  username?: string;
  id_compra: number; //Solo para que no me patee typescript
}

/**
 * Clase Base para los repositorios.
 * En esta clase tenemos únicamente métodos que leen datos.
 */
export abstract class BaseReadRepository<T extends DatosBase> {
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

  async exists(id: string | number): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.tableName} WHERE ${this.idName} = $1`;
    const res = await this.executor.query(query, [id]);
    return res.rows.length === 1;
  }
}
