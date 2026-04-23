import { Productor } from '@schemas/productores.schema.js';
import { BaseRepository } from './base.repository.js';
import { DeAcaInternal } from '@errors/response.errors.js';

class ProductorRepositoryClass extends BaseRepository<Productor> {
  protected readonly tableName = 'productores';
  protected readonly idName = 'id_productor';
  protected readonly slugName?: string = 'slug_productor'; //No ponemos acá para que no intente generarlo. Pero es el username

  protected readonly baseQuery = `
    SELECT P.*, DP.*
    FROM public.productores P
    JOIN public.usuarios U ON U.id_usuario = P.id_productor
    JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  override async update(id_productor: string, productor: Productor): Promise<Productor> {
    //TODO: Hacer transacción para actualizar productor y datos personales juntas.
    throw new DeAcaInternal('No implementado');
  }
  override async activate(id: string | number): Promise<void> {
    throw new DeAcaInternal('Para activar productor usar AuthRepository.');
  }
}

export const productorRepository = new ProductorRepositoryClass();
