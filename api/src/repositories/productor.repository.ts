import { Productor } from '@schemas/productores.schema.js';
import { BaseRepository } from './base.repository.js';
import { DeAcaInternal } from '@errors/response.errors.js';

class ProductorRepositoryClass extends BaseRepository<Productor> {
  protected readonly tableName = 'categorias';
  protected readonly idName = 'id_categoria';
  protected readonly slugName?: string; //No ponemos acá para que no intente generarlo. Pero es el username

  protected readonly baseQuery = `
    SELECT * FROM public.productores P
    JOIN public.usuarios U ON U.id_usuario = P.id_usuario
    JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  override async activate(id: string | number): Promise<void> {
    throw new DeAcaInternal('Para activar productor usar AuthRepository.');
  }
}

export const productorRepository = new ProductorRepositoryClass();
