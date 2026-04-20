import { Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { BaseRepository } from './base.repository.js';
import { myPool } from '@database/pool.js';

export class SubcategoriasRepositoryClass extends BaseRepository<Subcategoria> {
  protected readonly tableName = 'subcategorias';
  protected readonly idName = 'id_subcategoria';
  protected readonly slugName?: keyof Subcategoria = 'slug_subcategoria';

  protected readonly baseQuery = `
    WITH MIS_SUBCATEGORIAS AS (
      SELECT SC.*, C.slug_categoria 
      FROM subcategorias SC
      JOIN public.categorias C ON C.id_categoria = SC.id_categoria
    )
    SELECT * FROM MIS_SUBCATEGORIAS
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  async getEtiquetas(id_categoria: number, id_subcategoria: number): Promise<Etiqueta[]> {
    const query = `
      SELECT E.* 
      FROM public.subcategorias SC
      JOIN public.subcategoria_etiquetas SE ON SE.id_subcategoria = SC.id_subcategoria
      JOIN public.etiquetas E ON E.id_etiqueta = SE.id_etiqueta
      WHERE SC.id_categoria = $1 AND SC.id_subcategoria=$2
      ;
    `;
    const res = await myPool.query(query, [id_categoria, id_subcategoria]);
    return res.rows;
  }

  async addEtiqueta(id_categoria: number, id_subcategoria: number, id_etiqueta: number) {
    const query = `
      INSERT INTO subcategoria_etiquetas(id_subcategoria,id_etiqueta)
      SELECT id_subcategoria, $3
      FROM public.subcategorias S
      WHERE id_categoria = $1 AND id_subcategoria = $2
      ;
    `;
    console.log({ query });
    await myPool.query(query, [id_categoria, id_subcategoria, id_etiqueta]);
  }

  async removeEtiqueta(id_categoria: number, id_subcategoria: number, id_etiqueta: number) {
    const query = `
      DELETE FROM subcategoria_etiquetas SE
      USING public.subcategorias S
      WHERE S.id_categoria = $1  
        AND S.id_subcategoria = $2
        AND SE.id_etiqueta = $3
        AND SE.id_subcategoria = S.id_subcategoria -- clave para JOINEAR
        ;
    `;
    await myPool.query(query, [id_categoria, id_subcategoria, id_etiqueta]);
  }
}

export const subcategoriasRepository = new SubcategoriasRepositoryClass();
