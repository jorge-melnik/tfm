import { BaseRepository } from './base.repository.js';
import { Producto } from '@schemas/producto.schema.js';

export class ProductosRepositoryClass extends BaseRepository<Producto> {
  protected readonly tableName = 'productos';
  protected readonly idName = 'id_producto';
  protected readonly slugName?: keyof Producto = 'slug_producto';

  protected readonly baseQuery = `
    WITH MIS_ETIQUETAS AS (
      SELECT 
        PE.id_producto,
        COALESCE(
          json_agg(E.id_etiqueta ORDER BY E.id_etiqueta) FILTER (WHERE E.id_etiqueta IS NOT NULL), 
          '[]'
        ) AS id_etiquetas,
        COALESCE(
          json_agg(E.slug_etiqueta ORDER BY E.id_etiqueta) FILTER (WHERE E.slug_etiqueta IS NOT NULL), 
          '[]'
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
        DP.username,
        COALESCE(ME.id_etiquetas, '[]') AS id_etiquetas,
        COALESCE(ME.etiquetas, '[]') AS etiquetas,
        COALESCE(MF.fotos, '[]') AS fotos
      FROM productos P JOIN productores PP ON PP.id_productor = P.id_productor
      JOIN public.usuarios U ON U.id_usuario = PP.id_productor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
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
  async addEtiquetas(id_productor: string, id_producto: number, id_etiquetas: number[]) {
    if (id_etiquetas.length === 0) return;
    const query = `
      INSERT INTO public.producto_etiquetas (id_productor, id_producto, id_etiqueta )
      SELECT $1, $2, id_etiqueta
      FROM UNNEST($3::int[]) AS id_etiqueta
      ON CONFLICT (id_productor, id_producto, id_etiqueta) DO NOTHING
      ;
    `;
    await this.executor.query(query, [id_productor, id_producto, id_etiquetas]);
  }

  /**
   * Desasocia del producto los id_etiquetas especificados (si existen). Si no existen no falla.
   * @param id_productor
   * @param id_producto
   * @param id_etiquetas
   * @returns
   */
  async removeEtiquetas(id_productor: string, id_producto: number, id_etiquetas: number[]) {
    if (id_etiquetas.length === 0) return;
    const query = `
      DELETE FROM public.producto_etiquetas
      WHERE id_productor = $1 AND id_producto=$2 AND id_etiqueta =ANY($3::int[])
    `;
    await this.executor.query(query, [id_productor, id_producto, id_etiquetas]);
  }
}

export const productoRepository = new ProductosRepositoryClass();
