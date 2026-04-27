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
    SELECT * FROM pedidos C
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
