import { Consumidor, ItemCarrito } from '@schemas/consumidores.schema.js';
import { BaseRepository } from './base.repository.js';
import { AdicionalesProductor } from '@schemas/usuarios.schema.js';
import { DeAcaInternal } from '@errors/response.errors.js';
import { myPool } from '@database/pool.js';

export class ConsumidorRepositoryClass extends BaseRepository<Consumidor> {
  protected readonly tableName = 'consumidores';
  protected readonly idName = 'id_consumidor';
  protected readonly slugName?: string; //No ponemos acá para que no intente generarlo. Pero es el username

  protected readonly baseQuery = `
    SELECT C.*,DP.* 
    FROM public.consumidores C
    JOIN public.usuarios U ON U.id_usuario = C.id_consumidor
    JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  override async activate(id: string | number): Promise<void> {
    throw new DeAcaInternal(
      'Para activar productor en consumidor usar el método activarProductor de consumidor repository.',
    );
  }

  /**
   * Activar rol Productor para un consumidor ya existente.
   * A diferencia de activate en productorRepository, este hace INSERT o UPDATE según corresponda.
   * @param id_usuario
   * @param productor
   * @param client Se puede pasar un client si hay que ejecutarlo en la misma transacción. Caso register
   */
  async activarProductor(id_productor: string, productor: AdicionalesProductor) {
    const query = `
      INSERT into public.productores (id_productor,presentacion) 
      VALUES($1,$2)
      ON CONFLICT (id_productor) DO UPDATE                -- si ya existe 
      SET presentacion = EXCLUDED.presentacion, fecha_eliminacion = NULL
      WHERE productores.fecha_eliminacion IS NOT NULL   -- Solo si estaba desactivado.
      RETURNING *
      ;
    `;
    const params = [id_productor, productor.presentacion];
    const res = await this.executor.query(query, params);
    if (res.rows.length === 0) {
      throw new DeAcaInternal(`No es posible hacer ese cambio.`);
    }
  }

  async getCarrito(id_consumidor: string): Promise<ItemCarrito[]> {
    const consulta = `
      SELECT PC.* , P.precio, P.precio*PC.cantidad as subtotal
      FROM public.productos_carrito PC
      LEFT JOIN public.productos P ON P.id_productor = PC.id_productor AND P.id_producto=PC.id_producto
      WHERE id_consumidor=$1
    `;
    const res = await this.executor.query(consulta, [id_consumidor]);
    return res.rows;
  }

  /**
   * Permite agregar un item al carrito del consumidor. Si el producto ya existe en el carrito, falla.
   * @param item
   * @returns
   */
  async addItemCarrito(item: Omit<ItemCarrito, 'precio,subtotal'>): Promise<void> {
    const consulta = `
      INSERT INTO public.productos_carrito(id_productor,id_producto,id_consumidor,cantidad)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      ;
    `;
    await this.executor.query(consulta, [
      item.id_productor,
      item.id_producto,
      item.id_consumidor,
      item.cantidad,
    ]);
  }

  /**
   * Permite actualizar la cantidad de un item en el carrito del consumidor. Si el producto no existe, no falla.
   * @param item
   * @returns
   */
  async updateItemCarrito(item: Omit<ItemCarrito, 'precio,subtotal'>): Promise<void> {
    const consulta = `
      UPDATE public.productos_carrito
      SET cantidad=$4
      WHERE id_productor=$1 AND id_producto=$2 AND id_consumidor=$3
      RETURNING *
      ;
    `;
    await this.executor.query(consulta, [
      item.id_productor,
      item.id_producto,
      item.id_consumidor,
      item.cantidad,
    ]);
  }

  /**
   * Permite quitar un producto (sin importar su cantidad) del carrito de un consumidor.
   * @param item
   * @returns
   */
  async removeItemCarrito(item: Omit<ItemCarrito, 'precio,subtotal,cantidad'>): Promise<void> {
    const consulta = `
      DELETE FROM public.productos_carrito
      WHERE id_productor=$1 AND id_producto=$2 AND id_consumidor=$3
      RETURNING *
      ;
    `;
    await this.executor.query(consulta, [item.id_productor, item.id_producto, item.id_consumidor]);
  }
}

export const consumidorRepository = new ConsumidorRepositoryClass();
