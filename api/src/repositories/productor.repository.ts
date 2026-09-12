import { Productor } from '@schemas/productores.schema.js';
import { BaseRepository } from './base.repository.js';
import { InternalError } from '@errors/response.errors.js';
import { AdicionalesConsumidor } from '@schemas/usuarios.schema.js';

export class ProductorRepositoryClass extends BaseRepository<Productor> {
  protected readonly tableName = 'productores';
  protected readonly idName = 'id_productor';
  protected readonly slugName?: string = 'producto'; //No ponemos acá para que no intente generarlo. Pero es el username

  protected readonly baseQuery = `
    SELECT P.*, DP.*
    FROM public.productores P
    JOIN public.usuarios U ON U.id_usuario = P.id_productor
    LEFT JOIN public.ubicaciones UB ON UB.id_ubicacion = P.id_ubicacion
    LEFT JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  override async activate(id: string | number): Promise<void> {
    throw new InternalError(
      'Para activar productor en consumidor usar el método activarConsumidor en productor repository.',
    );
  }
  /**
   * Activar rol consumidor para un usuario ya existente que aún no lo tiene.
   * A diferencia de activate en consumidorRepository este hace insert o update controlando si el estado actual es válido.
   * @param id_usuario
   * @param consumidor
   * @param client Se puede pasar un client si hay que ejecutarlo en la misma transacción. Caso register
   */
  async activarConsumidor(id_consumidor: string, consumidor: AdicionalesConsumidor) {
    const query = `
        INSERT into public.consumidores (id_consumidor) 
        VALUES($1)
        ON CONFLICT (id_consumidor) DO UPDATE                -- si ya existe 
        SET fecha_eliminacion = NULL
        WHERE consumidores.fecha_eliminacion IS NOT NULL  -- Solo si estaba desactivado.
        RETURNING id_consumidor
        ;
      `;
    const res = await this.executor.query(query, [id_consumidor]);
    if (res.rows.length === 0) {
      throw new InternalError(`No es posible hacer ese cambio.`);
    }
  }
}

export const productorRepository = new ProductorRepositoryClass();
