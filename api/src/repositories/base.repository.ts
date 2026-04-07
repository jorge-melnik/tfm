import { myPool } from '@database/pool.js';
import { DeAcaInternal } from '@errors/response.errors.js';

export abstract class BaseRepository<T> {
  protected abstract readonly baseQuery: string;
  protected abstract readonly tableName: string;
  protected abstract readonly idName: string;

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
    if (keys.length === 0) throw new DeAcaInternal('No especificaste el filtro');

    const values = Object.values(filters);
    const condiciones = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    const query = `${this.baseQuery} AND ${condiciones}`;

    const res = await myPool.query(query, values);
    if (res.rows.length > 1)
      throw new DeAcaInternal('Se obtuvo más de un valor con ese filtro. Se esperaba uno.');
    return res.rows[0];
  }

  async add(data: Partial<T>): Promise<T> {
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
      throw new DeAcaInternal(`No se encontró el registro con ${this.idName}: ${id} para eliminar.`);
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    if (keys.length === 0) throw new DeAcaInternal('No hay datos para actualizar');

    const sets = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(data);

    const query = `
      UPDATE ${this.tableName} 
      SET ${sets} 
      WHERE ${this.idName} = $${keys.length + 1} 
      RETURNING *
    `;

    const res = await myPool.query(query, [...values, id]);

    if (res.rows.length === 0) {
      throw new DeAcaInternal(`No se pudo actualizar: registro con ${this.idName} ${id} no existe.`);
    }

    return res.rows[0];
  }

  async exists(id: string | number): Promise<boolean> {
    if (!id) throw new DeAcaInternal('No se proporcionó un ID para verificar existencia');

    const query = `SELECT 1 FROM ${this.tableName} WHERE ${this.idName} = $1`;

    const res = await myPool.query(query, [id]);

    return res.rows.length === 1;
  }
}
