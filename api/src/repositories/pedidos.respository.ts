import { EstadoPedido, Pedido, ProductoPedido } from '@schemas/compras.schema.js';
import { BaseReadRepository } from './base.read.repository.js';
import { DeAcaBadRequest } from '@errors/response.errors.js';

/**
 * Repository para Pedidos. Extiende BaseReadRepository. Por lo que no cuenta con métodos, add, update, etc.
 */
export class PedidosRepositoryClass extends BaseReadRepository<Pedido> {
  protected readonly tableName = 'pedidos';
  protected readonly idName = 'id_pedido';
  protected readonly slugName?: keyof Pedido;

  protected readonly baseQuery = `
    WITH MIS_PEDIDOS AS (
      SELECT P.*, DPP.username as productor, DPC.username as consumidor, C.id_consumidor
      ,json_agg(
        json_build_object(
          'nombre', PRO.nombre,
          'cantidad', PP.cantidad,
          'precio', PP.precio_unitario,
          'subtotal', PP.subtotal,
          'imagenes', COALESCE(IMG.imagenes, '[]'::json)
        )
      ) AS productos 
      ,(
        SELECT COUNT(*) 
        FROM mensajes M
        WHERE M.id_pedido = P.id_pedido
          AND M.id_emisor != P.id_productor 
          AND M.fecha_creacion >= P.fecha_lectura_productor
      ) AS mensajes_no_leidos_productor
      -- No hacemos otro join para estos porque me duplica filas.
      ,(
        SELECT COUNT(*) 
        FROM mensajes M
        WHERE M.id_pedido = P.id_pedido
          AND M.id_emisor != C.id_consumidor 
          AND M.fecha_creacion >= P.fecha_lectura_consumidor
      ) AS mensajes_no_leidos_consumidor
      FROM pedidos P
      JOIN public.compras C ON C.id_compra = P.id_compra
      JOIN public.datos_personales DPP ON DPP.id_usuario = P.id_productor
      JOIN public.datos_personales DPC ON DPC.id_usuario = C.id_consumidor
      JOIN public.pedido_productos PP ON PP.id_pedido = P.id_pedido
      JOIN public.productos PRO ON PRO.id_producto = PP.id_producto
      LEFT JOIN LATERAL (
        SELECT id_producto, json_agg(PI.*) AS imagenes
        FROM public.producto_imagenes PI
        GROUP BY id_producto
      ) IMG ON IMG.id_producto = PRO.id_producto
      GROUP BY P.id_pedido, DPP.username, DPC.username, C.id_consumidor
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

  /**
   * Función para cambiar de estado un Pedido. Se encarga de invocar los cambios según el estado_pedido actual.
   * @param id_productor
   * @param id_pedido
   * @param estadoPedido
   * @returns
   */
  public async cambiarEstado(id_productor: string, id_pedido: number, estadoPedido: EstadoPedido) {
    if (estadoPedido === 'LISTO PARA ENTREGA') return this.marcarListoParaEntrega(id_productor, id_pedido);

    if (estadoPedido === 'ENTREGADO') return this.marcarEntregado(id_productor, id_pedido);
    //TODO: Considererar otros cambios de estado manual.
    throw new DeAcaBadRequest(
      'No se permite cambiar el pedido a estado ' + estadoPedido + ' en el estado actual.',
    );
  }

  /**
   * Pasa un pedido de estado PAGADO a estado LISTO PARA ENTREGA
   * @param id_productor
   * @param id_pedido
   */
  private async marcarListoParaEntrega(id_productor: string, id_pedido: number) {
    const estadoActual: EstadoPedido = 'PAGADO';
    const nuevoEstado: EstadoPedido = 'LISTO PARA ENTREGA';
    const consulta = `
      UPDATE public.pedidos
      SET estado_pedido = $4
      WHERE id_productor=$1 AND id_pedido=$2 AND estado_pedido=$3
      RETURNING *
    `;

    const res = await this.executor.query(consulta, [id_productor, id_pedido, estadoActual, nuevoEstado]);

    if (res.rowCount === 0)
      throw new DeAcaBadRequest(
        'No existe el pedido o no se encuentra en un estado válido para dicha acción.',
      );
  }

  /**
   * Pasa un pedido de estado LISTO PARA ENTREGA a estado ENTREGADO
   * @param id_productor
   * @param id_pedido
   */
  private async marcarEntregado(id_productor: string, id_pedido: number) {
    const estadoActual: EstadoPedido = 'LISTO PARA ENTREGA';
    const nuevoEstado: EstadoPedido = 'ENTREGADO';
    const consulta = `
      UPDATE public.pedidos
      SET estado_pedido = $4
      WHERE id_productor=$1 AND id_pedido=$2 AND estado_pedido=$3
      RETURNING *
    `;

    const res = await this.executor.query(consulta, [id_productor, id_pedido, estadoActual, nuevoEstado]);

    if (res.rowCount === 0)
      throw new DeAcaBadRequest(
        'No existe el pedido o no se encuentra en un estado válido para dicha acción.',
      );
  }

  public async productorLeyoMensajes(id_pedido: number) {
    const consulta = `
      UPDATE pedidos
      SET fecha_lectura_productor = CURRENT_TIMESTAMP
      WHERE id_pedido = $1
      ;
    `;
    await this.executor.query(consulta, [id_pedido]);
  }

  public async consumidorLeyoMensajes(id_pedido: number) {
    const consulta = `
      UPDATE pedidos
      SET fecha_lectura_consumidor = CURRENT_TIMESTAMP
      WHERE id_pedido = $1
      ;
    `;
    await this.executor.query(consulta, [id_pedido]);
  }
}

export const pedidosRepository = new PedidosRepositoryClass();
