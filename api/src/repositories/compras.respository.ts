import { Compra, Pago } from '@schemas/compras.schema.js';
import { BaseReadRepository } from './base.read.repository.js';

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
    pago: Omit<Pago, 'id_Pago,fecha_creacion,fecha_modificacion'>,
  ): Promise<void> {
    const consulta = `
      INSERT INTO public.pagos VALUES(id_compra,id_externo, metodo_pago,estado_pago)
      VALUES($1,$2,$3,$4)
      ;
    `;
    await this.executor.query(consulta, [
      pago.id_compra,
      pago.id_externo,
      pago.metodo_pago,
      pago.estado_pago,
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
