import { Subcategoria } from '@schemas/categoria.schema.js';
import { BaseRepository } from './base.repository.js';

export class SubcategoriasRepositoryClass extends BaseRepository<Subcategoria> {
  protected readonly tableName = 'subcategorias';
  protected readonly idName = 'id_subcategoria';
  protected readonly slugName?: keyof Subcategoria = 'slug_subcategoria';

  protected readonly baseQuery = `
    SELECT SC.*, C.slug_categoria FROM subcategorias SC
    JOIN public.categorias C ON C.id_categoria = SC.id_categoria
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  // async getByCategoriaSlug(slug: string) {
  //   const query = `
  //     ${this.baseQuery}
  //     AND C.slug=$1
  //   `;
  //   const res = await myPool.query(query, [slug]);

  //   if (res.rowCount === 0) {
  //     throw new DeAcaNotFound(`No se encontró el registro con slug: ${slug} para eliminar.`);
  //   }

  //   return res.rows;
  // }
}

export const subcategoriasRepository = new SubcategoriasRepositoryClass();
