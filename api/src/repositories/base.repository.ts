import { myPool } from '@database/pool.js';
import { DeAcaBadRequest, DeAcaInternal, DeAcaNotFound } from '@errors/response.errors.js';

interface DatosBase {
  nombre?: string;
  username: string;
}
export abstract class BaseRepository<T extends DatosBase> {
  protected abstract readonly baseQuery: string;
  protected abstract readonly tableName: string;
  protected abstract readonly idName: string;
  protected abstract slugName?: string;

  async getCount(onlyActive: boolean | undefined = undefined): Promise<number> {
    const params = [];
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    if (onlyActive !== undefined) {
      params.push(onlyActive);
      query += ' WHERE activo=$1';
    }
    const res = await myPool.query(query, params);
    return parseInt(res.rows[0].total, 10);
  }

  async getAll(): Promise<T[]> {
    const res = await myPool.query(this.baseQuery);
    return res.rows;
  }

  async getBy(filters: Partial<T>): Promise<T[]> {
    const keys = Object.keys(filters);
    if (keys.length === 0) throw new DeAcaInternal('No especificaste el filtro');

    const values = Object.values(filters);
    const condiciones = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    const query = `${this.baseQuery} AND ${condiciones}`;
    const res = await myPool.query(query, values);
    return res.rows;
  }

  async getOneBy(filters: Partial<T>): Promise<T> {
    const keys = Object.keys(filters);
    if (keys.length === 0) throw new DeAcaBadRequest('No especificaste el filtro');

    const values = Object.values(filters);
    const condiciones = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    const query = `${this.baseQuery} AND ${condiciones}`;

    const res = await myPool.query(query, values);
    if (res.rows.length > 1)
      throw new DeAcaInternal('Se obtuvo más de un valor con ese filtro. Se esperaba uno.');
    return res.rows[0];
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

    const res = await myPool.query(query, values);
    //Sintaxis Computada [this.idName]: valor
    const filtro = { [this.idName]: res.rows[0][this.idName] } as Partial<T>;

    return this.getOneBy(filtro);
  }

  async remove(id: string | number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.idName} = $1`;
    const res = await myPool.query(query, [id]);

    if (res.rowCount === 0) {
      throw new DeAcaNotFound(`No se encontró el registro con ${this.idName}: ${id} para eliminar.`);
    }
  }

  public async deactivate(id: string | number) {
    const query = `UPDATE ${this.tableName} SET fecha_eliminacion=CURRENT_TIMESTAMP WHERE ${this.idName} = $1 AND activo=true`;
    const res = await myPool.query(query, [id]);

    if (res.rowCount === 0) {
      throw new DeAcaNotFound(`No se encontró el registro con ${this.idName}: ${id} activo para desactivar.`);
    }
  }

  public async activate(id: string | number) {
    const query = `UPDATE ${this.tableName} SET fecha_eliminacion=null WHERE ${this.idName} = $1 AND activo=false`;
    const res = await myPool.query(query, [id]);

    if (res.rowCount === 0) {
      throw new DeAcaNotFound(`No se encontró el registro con ${this.idName}: ${id} inactivo para activar.`);
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
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

    const res = await myPool.query(query, [...values, id]);

    if (res.rows.length === 0) {
      throw new DeAcaNotFound(`No se pudo actualizar: registro con ${this.idName} ${id} no existe.`);
    }

    const filtro = { [this.idName as string]: id } as Partial<T>;
    return this.getOneBy(filtro);
  }

  async exists(id: string | number): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.tableName} WHERE ${this.idName} = $1`;
    const res = await myPool.query(query, [id]);
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
