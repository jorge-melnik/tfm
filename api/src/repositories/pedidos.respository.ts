import { Pedido, ProductoPedido } from '@schemas/compras.schema.js';
import { BaseReadRepository } from './base.read.repository.js';

/**
 * Repository para Pedidos. Extiende BaseReadRepository. Por lo que no cuenta con métodos, add, update, etc.
 */
export class PedidosRepositoryClass extends BaseReadRepository<Pedido> {
  protected readonly tableName = 'pedidos';
  protected readonly idName = 'id_pedido';
  protected readonly slugName?: keyof Pedido;

  protected readonly baseQuery = `
    WITH MIS_PEDIDOS AS (
      SELECT P.*, DP.username as productor 
      ,json_agg(
        json_build_object(
          'nombre', PRO.nombre,
          'cantidad', PP.cantidad,
          'precio', PP.precio_unitario,
          'subtotal', PP.subtotal,
          'imagenes', COALESCE(IMG.imagenes, '[]'::json)
        )
      ) AS productos 
      FROM pedidos P
      JOIN public.datos_personales DP ON DP.id_usuario = P.id_productor
      JOIN public.pedido_productos PP ON PP.id_pedido = P.id_pedido
      JOIN public.productos PRO ON PRO.id_producto = PP.id_producto
      LEFT JOIN LATERAL (
        SELECT id_producto, json_agg(PI.*) AS imagenes
        FROM public.producto_imagenes PI
        GROUP BY id_producto
      ) IMG ON IMG.id_producto = PRO.id_producto
      GROUP BY P.id_pedido, DP.username
    )
    SELECT * FROM MIS_PEDIDOS
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  /**
   * Permite obtener el listado de productos de un pedido dado.
   * @param id_productor
   * @param id_pedido
   * @returns
   */
  async getProductos(id_productor: string, id_pedido: number): Promise<ProductoPedido[]> {
    const consulta = `
      SELECT PP.*, P.nombre
      FROM public pedido_productos PP
      JOIN public.productos P ON P.id_productor = PP.id_productor AND P.id_producto = PP.id_producto
      WHERE PP.id_productor=$1 AND PP.id_pedido=$2
    `;
    const { rows } = await this.executor.query(consulta, [id_productor, id_pedido]);
    return rows;
  }
}

export const pedidosRepository = new PedidosRepositoryClass();
