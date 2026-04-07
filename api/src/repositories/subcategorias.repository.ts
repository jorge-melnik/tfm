import { Subcategoria } from '@schemas/categoria.schema.js';
import { BaseRepository } from './base.repository.js';

export class SubcategoriasRepositoryClass extends BaseRepository<Subcategoria> {
  protected readonly tableName = 'categorias';
  protected readonly idName = 'id_subcategoria';

  protected readonly baseQuery = `
    SELECT * FROM subcategorias sc
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const subcategoriasRepository = new SubcategoriasRepositoryClass();
