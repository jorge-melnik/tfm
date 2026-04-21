import { BaseRepository } from './base.repository.js';
import { Producto } from '@schemas/producto.schema.js';

export class ProductosRepositoryClass extends BaseRepository<Producto> {
  protected readonly tableName = 'etiquetas';
  protected readonly idName = 'id_etiqueta';
  protected readonly slugName?: keyof Producto = 'slug_producto';

  protected readonly baseQuery = `
    SELECT * FROM etiquetas e
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const productoRepository = new ProductosRepositoryClass();
