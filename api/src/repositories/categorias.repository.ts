import { Categoria, Etiqueta } from '@schemas/categoria.schema.js';
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

  async getEtiquetas(categoria: number | string): Promise<Etiqueta[]> {
    const claveCategoria = typeof categoria === 'number' ? 'id_categoria' : 'slug_categoria';
    const query = `
        SELECT E.* , SC.slug_subcategoria, C.slug_categoria
        FROM public.subcategorias SC
        JOIN public.categorias C ON SC.id_categoria = C.id_categoria
        JOIN public.subcategoria_etiquetas SE ON SE.id_subcategoria = SC.id_subcategoria
        JOIN public.etiquetas E ON E.id_etiqueta = SE.id_etiqueta
        WHERE C.${claveCategoria} = $1
        ;
      `;
    const res = await this.executor.query(query, [categoria]);
    return res.rows;
  }
}

export const categoriasRepository = new CategoriasRepositoryClass();
