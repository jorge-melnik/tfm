import { DeAcaBadRequest, DeAcaNotFound } from '@errors/response.errors.js';
import { BaseReadRepository } from './base.read.repository.js';

interface DatosBase {
  nombre?: string;
  username?: string;
  id_compra: number; //Solo para que no me patee typescript
}

export abstract class BaseRepository<T extends DatosBase> extends BaseReadRepository<T> {
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
