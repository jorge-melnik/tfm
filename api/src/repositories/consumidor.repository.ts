import { Consumidor } from '@schemas/consumidores.schema.js';
import { BaseRepository } from './base.repository.js';

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
}

export const consumidorRepository = new ConsumidorRepositoryClass();
