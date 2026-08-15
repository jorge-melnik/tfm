import { Compra, CompraPOST, Pago } from '@schemas/compras.schema.js';
import { BaseReadRepository } from './base.read.repository.js';
import { DeAcaForbidden } from '@errors/response.errors.js';

/**
 * Repository para Compras. Extiende BaseReadRepository. Por lo que no cuenta con métodos, add, update, etc.
 */
export class ComprasRepositoryClass extends BaseReadRepository<Compra> {
  protected readonly tableName = 'compras';
  protected readonly idName = 'id_compra';
  protected readonly slugName?: keyof Compra;

  protected readonly baseQuery = `
    SELECT * FROM compras C
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  async createFromCarrito(id_usuario: string, compra: CompraPOST): Promise<Compra> {
    const { direccion_envio, contacto_receptor } = compra;

    const consulta = `
      WITH PRODUCTOS_PRODUCTOR AS (
        SELECT CP.id_consumidor, P.id_productor, P.id_producto, CP.cantidad, P.precio
        FROM carrito_productos CP
        JOIN productos P ON CP.id_producto = P.id_producto
        WHERE CP.id_consumidor = $1
        GROUP BY P.id_producto, CP.id_consumidor, CP.cantidad
      ),
      NUEVA_COMPRA AS (
        INSERT INTO compras (id_consumidor, direccion_envio, contacto_receptor)
        SELECT $1, $2, $3
        WHERE EXISTS (SELECT 1 FROM PRODUCTOS_PRODUCTOR) -- Para no crear compra si el carrito está vacío.
        RETURNING *
      ),
      NUEVOS_PEDIDOS AS (
        INSERT INTO pedidos (id_productor, id_compra)
        SELECT DISTINCT PP.id_productor, NC.id_compra -- DISTINCT devuelve una sola vez cada productor.
        FROM PRODUCTOS_PRODUCTOR PP
        CROSS JOIN NUEVA_COMPRA NC
        RETURNING id_pedido, id_productor
      ),
      PRODUCTOS_PEDIDO AS (
        INSERT INTO public.pedido_productos (id_pedido, id_productor, id_producto, cantidad, precio_unitario)
        SELECT NP.id_pedido, NP.id_productor, PP.id_producto, PP.cantidad, PP.precio
        FROM PRODUCTOS_PRODUCTOR PP
        JOIN NUEVOS_PEDIDOS NP ON NP.id_productor = PP.id_productor
      ),
      CHAU_CARRITO AS (
        DELETE FROM carrito_productos
        WHERE id_consumidor = $1 AND EXISTS (SELECT 1 FROM PRODUCTOS_PRODUCTOR)
      )
      -- Retornamos el resultado final de la compra creada
      SELECT * FROM nueva_compra;
    `;

    const { rows } = await this.executor.query(consulta, [id_usuario, direccion_envio, contacto_receptor]);
    if (rows.length === 0) throw new DeAcaForbidden('Tu carrito está vacío.');
    return rows[0];
  }

  /**
   * Devuelve todos los pagos que recibió la compra. Aún si no fueron aprobados.
   * @param id_compra
   * @returns
   */
  async getPagos(id_compra: number): Promise<Pago[]> {
    const consulta = 'SELECT C.* FROM public.compras C';
    const { rows } = await this.executor.query(consulta, [id_compra]);
    return rows;
  }

  /**
   * Agrega un pago a la compra
   * @param id_compra
   * @param pago
   */
  async addPago(
    id_compra: number,
    pago: Pick<Pago, 'id_compra' | 'id_externo' | 'metodo_pago' | 'estado_pago' | 'respuesta_raw'>,
  ): Promise<void> {
    if (id_compra !== pago.id_compra) throw new DeAcaForbidden('No coincide el id_compra.');
    const consulta = `
      INSERT INTO public.pagos VALUES(id_compra,id_externo, metodo_pago,estado_pago,respuesta_raw)
      VALUES($1,$2,$3,$4)
      ;
    `;
    await this.executor.query(consulta, [
      id_compra,
      pago.id_externo,
      pago.metodo_pago,
      pago.estado_pago,
      pago.respuesta_raw,
    ]);
  }

  //TODO: Falta trigger para que se actualice el estado_compra en base al estado_pago

  async aprobarPago(id_compra: number, id_pago: string): Promise<void> {
    const consulta = `
      UPDATE public.pagos 
      SET estado_pago='APROBADO'
      WHERE id_compra = $1 AND id_pago=$2 AND estado_pago = 'PENDIENTE' -- Solo se puede confirmar si está pendiente
      ;
    `;
    await this.executor.query(consulta, [id_compra, id_pago]); //FIXME: Si es posible tener los dos mejor.
  }

  async cancelarPago(id_compra: number, id_pago: string): Promise<void> {
    const consulta = `
      UPDATE public.pagos 
      SET estado_pago='CANCELADO'
      WHERE id_compra = $1 AND id_pago=$2 AND estado_pago = 'PENDIENTE' -- Solo se puede confirmar si está pendiente
      ;
    `;
    await this.executor.query(consulta, [id_compra, id_pago]); //FIXME: Si es posible tener los dos mejor.
  }

  async rechazarPago(id_compra: number, id_pago: string): Promise<void> {
    const consulta = `
      UPDATE public.pagos 
      SET estado_pago='RECHAZADO'
      WHERE id_compra = $1 AND id_pago=$2 AND estado_pago = 'PENDIENTE' -- Solo se puede confirmar si está pendiente
      ;
    `;
    await this.executor.query(consulta, [id_compra, id_pago]); //FIXME: Si es posible tener los dos mejor.
  }
}

export const comprasRepository = new ComprasRepositoryClass();
