import { Categoria } from '@schemas/categoria.schema.js';
import { BaseRepository } from './base.repository.js';

class CategoriasRepositoryClass extends BaseRepository<Categoria> {
  protected readonly tableName = 'categorias';
  protected readonly idName = 'id_categoria';
  protected readonly slugName?: keyof Categoria = 'slug_categoria';

  protected readonly baseQuery = `
    SELECT * FROM categorias c
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const categoriasRepository = new CategoriasRepositoryClass();
