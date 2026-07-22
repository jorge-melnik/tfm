import { Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { BaseRepository } from './base.repository.js';

export class SubcategoriasRepositoryClass extends BaseRepository<Subcategoria> {
  protected readonly tableName = 'subcategorias';
  protected readonly idName = 'id_subcategoria';
  protected readonly slugName?: keyof Subcategoria = 'slug_subcategoria';

  protected readonly baseQuery = `
    WITH MIS_SUBCATEGORIAS AS (
      SELECT SC.*, C.slug_categoria, C.color, C.icono, json_agg(SE.id_etiqueta) as id_etiquetas
      FROM subcategorias SC
      JOIN public.categorias C ON C.id_categoria = SC.id_categoria
      JOIN public.subcategoria_etiquetas SE ON SE.id_subcategoria=SC.id_subcategoria
      GROUP BY SC.id_subcategoria, C.id_categoria
      ORDER BY C.id_categoria, SC.id_subcategoria
    )
    SELECT * FROM MIS_SUBCATEGORIAS
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  async getEtiquetas(subcategoria: number | string): Promise<Etiqueta[]> {
    const claveSubcategoria = typeof subcategoria === 'number' ? 'id_subcategoria' : 'slug_subcategoria';
    const query = `
      SELECT E.* , SC.slug_subcategoria, C.slug_categoria
      FROM public.subcategorias SC
      JOIN public.categorias C ON SC.id_categoria = C.id_categoria
      JOIN public.subcategoria_etiquetas SE ON SE.id_subcategoria = SC.id_subcategoria
      JOIN public.etiquetas E ON E.id_etiqueta = SE.id_etiqueta
      WHERE SC.${claveSubcategoria}=$1
      ;
    `;
    const res = await this.executor.query(query, [subcategoria]);
    return res.rows;
  }

  async addEtiqueta(id_subcategoria: number, id_etiqueta: number) {
    const query = `
      INSERT INTO subcategoria_etiquetas(id_subcategoria,id_etiqueta)
      SELECT id_subcategoria, $2
      FROM public.subcategorias S
      WHERE id_subcategoria = $1
      ;
    `;
    await this.executor.query(query, [id_subcategoria, id_etiqueta]);
  }

  async removeEtiqueta(id_subcategoria: number, id_etiqueta: number) {
    const query = `
      DELETE FROM subcategoria_etiquetas SE
      USING public.subcategorias S
      WHERE S.id_subcategoria = $1
        AND SE.id_etiqueta = $2
        AND SE.id_subcategoria = S.id_subcategoria -- clave para JOINEAR
        ;
    `;
    await this.executor.query(query, [id_subcategoria, id_etiqueta]);
  }

  async setEtiquetas(id_subcategoria: number, id_etiquetas: number[]) {
    const query = `
      WITH PARA_INSERTAR as (
        SELECT S.id_subcategoria, E.id_etiqueta
        FROM public.subcategorias S
        CROSS JOIN unnest($2::INT[]) AS E(id_etiqueta)
        LEFT JOIN public.subcategoria_etiquetas SE on SE.id_subcategoria = S.id_subcategoria and SE.id_etiqueta = E.id_etiqueta
        WHERE S.id_subcategoria =$1
        AND SE.id_etiqueta is null -- Solo me interesan las que hay que insertar
      ),
      INSERCION as (
        INSERT INTO public.subcategoria_etiquetas (id_subcategoria,id_etiqueta)
        SELECT * FROM PARA_INSERTAR
      )
      DELETE FROM public.subcategoria_etiquetas where id_subcategoria=$1 and id_etiqueta <>ALL($2::INT[])
  `;

    await this.executor.query(query, [id_subcategoria, id_etiquetas]);
  }
}

export const subcategoriasRepository = new SubcategoriasRepositoryClass();
