import { BaseRepository } from './base.repository.js';
import { Producto } from '@schemas/producto.schema.js';

export class ProductosRepositoryClass extends BaseRepository<Producto> {
  protected readonly tableName = 'etiquetas';
  protected readonly idName = 'id_etiqueta';
  protected readonly slugName?: keyof Producto = 'slug_producto';

  protected readonly baseQuery = `
    SELECT P.*, PS.username
    FROM productos P
    JOIN productores PS ON PS.id_usuario=P.id_productor
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const productoRepository = new ProductosRepositoryClass();
