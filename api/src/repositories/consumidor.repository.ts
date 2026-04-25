import { Consumidor } from '@schemas/consumidores.schema.js';
import { BaseRepository } from './base.repository.js';
import { AdicionalesProductor } from '@schemas/usuarios.schema.js';
import { DeAcaInternal } from '@errors/response.errors.js';

class ConsumidorRepositoryClass extends BaseRepository<Consumidor> {
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
}

export const consumidorRepository = new ConsumidorRepositoryClass();
