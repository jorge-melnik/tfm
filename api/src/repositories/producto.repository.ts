import { BaseRepository } from './base.repository.js';
import { Producto } from '@schemas/producto.schema.js';

export class ProductosRepositoryClass extends BaseRepository<Producto> {
  protected readonly tableName = 'productos';
  protected readonly idName = 'id_producto';
  protected readonly slugName?: keyof Producto = 'slug_producto';

  protected readonly baseQuery = `
    WITH MIS_PRODUCTOS AS (
      SELECT P.*, DP.username, json_agg(PE.id_etiqueta) as id_etiquetas, json_agg(DISTINCT E.nombre) as etiquetas
      FROM productos P
      JOIN productores PP ON PP.id_productor=P.id_productor
      JOIN public.usuarios U ON U.id_usuario = PP.id_productor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      LEFT JOIN public.producto_etiquetas PE ON PE.id_producto=P.id_producto
      LEFT JOIN public.etiquetas E ON E.id_etiqueta = PE.id_etiqueta
      GROUP BY P.id_producto,P.id_productor, DP.id_usuario
    )
    SELECT * FROM MIS_PRODUCTOS P
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const productoRepository = new ProductosRepositoryClass();
