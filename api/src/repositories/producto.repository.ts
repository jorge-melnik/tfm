import { DeAcaBadRequest } from '@errors/response.errors.js';
import { BaseRepository } from './base.repository.js';
import { Producto } from '@schemas/producto.schema.js';

export class ProductosRepositoryClass extends BaseRepository<Producto> {
  protected readonly tableName = 'productos';
  protected readonly idName = 'id_producto';
  protected readonly slugName?: keyof Producto = 'producto';

  protected readonly baseQuery = `
    WITH MIS_ETIQUETAS AS (
      SELECT 
        PE.id_producto,
        COALESCE(
          array_agg(E.id_etiqueta ORDER BY E.id_etiqueta) FILTER (WHERE E.id_etiqueta IS NOT NULL), 
          ARRAY[]::INT[] 
        ) AS id_etiquetas,
        COALESCE(
          array_agg(E.etiqueta ORDER BY E.id_etiqueta) FILTER (WHERE E.etiqueta IS NOT NULL), 
          ARRAY[]::TEXT[] 
        ) AS etiquetas
      FROM public.producto_etiquetas PE
      JOIN public.etiquetas E ON E.id_etiqueta = PE.id_etiqueta
      GROUP BY PE.id_producto
    ),
    MIS_FOTOS AS (
      SELECT 
        PI.id_producto,
        COALESCE(
          json_agg(PI.path) FILTER (WHERE PI.path IS NOT NULL),
          '[]'
        ) AS fotos
      FROM public.producto_imagenes PI
      GROUP BY PI.id_producto
    ),
    MIS_PRODUCTOS AS (
      SELECT 
        P.*,
        C.categoria,
        SC.subcategoria,
        SC.id_categoria,
        DP.username, 
        COALESCE(ME.id_etiquetas, ARRAY[]::INT[] ) AS id_etiquetas,
        COALESCE(ME.etiquetas, ARRAY[]::TEXT[] ) AS etiquetas,
        COALESCE(MF.fotos, '[]') AS fotos
      FROM productos P 
      JOIN productores PP ON PP.id_productor = P.id_productor
      JOIN public.usuarios U ON U.id_usuario = PP.id_productor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      JOIN public.subcategorias SC ON SC.id_subcategoria = P.id_subcategoria
      JOIN public.categorias C ON C.id_categoria=SC.id_categoria
      LEFT JOIN MIS_ETIQUETAS ME ON ME.id_producto = P.id_producto
      LEFT JOIN MIS_FOTOS MF ON MF.id_producto = P.id_producto
    )
    SELECT * FROM MIS_PRODUCTOS P
    WHERE 1=1
  `;

  constructor() {
    super();
  }

  /**
   * Asocia los id_etiquetas indicados al producto. Si ya existe algún id_etiqueta no pasa nada.
   * @param id_productor
   * @param id_producto
   * @param id_etiquetas
   * @returns
   */
  async addEtiquetas(id_producto: number, id_etiquetas: number[]) {
    if (id_etiquetas.length === 0)
      throw new DeAcaBadRequest('No se indicaron ids de etiquetas a asociar al producto.');
    const query = `
      INSERT INTO public.producto_etiquetas (id_producto, id_etiqueta )
      SELECT $1, id_etiqueta
      FROM UNNEST($2::int[]) AS id_etiqueta
      ON CONFLICT (id_producto, id_etiqueta) DO NOTHING
      ;
    `;
    await this.executor.query(query, [id_producto, id_etiquetas]);
  }

  /**
   * Desasocia del producto los id_etiquetas especificados (si existen). Si no existen no falla.
   * @param id_productor
   * @param id_producto
   * @param id_etiquetas
   * @returns
   */
  async removeEtiquetas(id_producto: number, id_etiquetas: number[]) {
    if (id_etiquetas.length === 0)
      throw new DeAcaBadRequest('No se indicaron ids de etiquetas a asociar al producto.');
    const query = `
      DELETE FROM public.producto_etiquetas
      WHERE id_producto=$1 AND id_etiqueta =ANY($2::int[])
    `;
    await this.executor.query(query, [id_producto, id_etiquetas]);
  }
}

export const productoRepository = new ProductosRepositoryClass();
