import { Consumidor, ItemCarrito } from '@schemas/consumidores.schema.js';
import { BaseRepository } from './base.repository.js';
import { AdicionalesProductor } from '@schemas/usuarios.schema.js';
import { DeAcaInternal } from '@errors/response.errors.js';

export class ConsumidorRepositoryClass extends BaseRepository<Consumidor> {
  protected readonly tableName = 'consumidores';
  protected readonly idName = 'id_consumidor';
  protected readonly slugName?: string; //No ponemos acá para que no intente generarlo. Pero es el username

  protected readonly baseQuery = `
    SELECT C.*,DP.* 
    FROM public.consumidores C
    JOIN public.usuarios U ON U.id_usuario = C.id_consumidor
    LEFT JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
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
      -- Seleccionaos todas las columnas de producto y que se filtren en el esquema.
      SELECT P.*, PC.id_consumidor ,PC.cantidad, P.precio*PC.cantidad as subtotal, DP.username,
      (
        SELECT COALESCE(
          json_agg(PI.path ORDER BY PI.posicion),
          '[]'::json
        )
        FROM public.producto_imagenes PI
        WHERE PI.id_producto = P.id_producto
      ) AS fotos
      FROM public.carrito_productos PC
      JOIN public.productos P ON P.id_producto=PC.id_producto
      JOIN Public.productores PR ON PR.id_productor=P.id_productor
      JOIN public.datos_personales DP ON DP.id_usuario = PR.id_productor
      WHERE id_consumidor=$1
      ORDER BY P.nombre
    `;
    const res = await this.executor.query(consulta, [id_consumidor]);
    return res.rows;
  }

  /**
   * Permite agregar un item al carrito del consumidor. Si el producto ya existe en el carrito, falla.
   * @param item
   * @returns
   */
  async addItemCarrito(item: Pick<ItemCarrito, 'id_producto' | 'id_consumidor' | 'cantidad'>): Promise<void> {
    const consulta = `
      INSERT INTO public.carrito_productos(id_producto,id_consumidor,cantidad)
      VALUES ($1,$2,$3)
      RETURNING *
      ;
    `;
    await this.executor.query(consulta, [item.id_producto, item.id_consumidor, item.cantidad]);
  }

  /**
   * Permite actualizar la cantidad de un item en el carrito del consumidor. Si el producto no existe, no falla.
   * @param item
   * @returns
   */
  async updateItemCarrito(
    item: Pick<ItemCarrito, 'id_producto' | 'id_consumidor' | 'cantidad'>,
  ): Promise<void> {
    const consulta = `
      UPDATE public.carrito_productos
      SET cantidad=$3
      WHERE id_producto=$1 AND id_consumidor=$2
      RETURNING *
      ;
    `;
    await this.executor.query(consulta, [item.id_producto, item.id_consumidor, item.cantidad]);
  }

  /**
   * Permite quitar un producto (sin importar su cantidad) del carrito de un consumidor.
   * O sea, elimina todas las cantidades del carrito
   * @param item
   * @returns
   */
  async removeItemCarrito(item: Pick<ItemCarrito, 'id_producto' | 'id_consumidor'>): Promise<void> {
    const consulta = `
      DELETE FROM public.carrito_productos
      WHERE id_producto=$1 AND id_consumidor=$2
      RETURNING *
      ;
    `;
    await this.executor.query(consulta, [item.id_producto, item.id_consumidor]);
  }
}

export const consumidorRepository = new ConsumidorRepositoryClass();
