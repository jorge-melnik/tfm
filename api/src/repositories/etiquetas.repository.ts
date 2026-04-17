import { Etiqueta } from '@schemas/categoria.schema.js';
import { BaseRepository } from './base.repository.js';

export class EtiquetasRepositoryClass extends BaseRepository<Etiqueta> {
  protected readonly tableName = 'etiquetas';
  protected readonly idName = 'id_etiqueta';
  protected readonly slugName?: keyof Etiqueta;

  protected readonly baseQuery = `
    SELECT * FROM etiquetas e
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const etiquetasRepository = new EtiquetasRepositoryClass();
