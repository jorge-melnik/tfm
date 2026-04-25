import { BaseRepository } from './base.repository.js';
import { Producto } from '@schemas/producto.schema.js';

export class ProductosRepositoryClass extends BaseRepository<Producto> {
  protected readonly tableName = 'productos';
  protected readonly idName = 'id_producto';
  protected readonly slugName?: keyof Producto = 'slug_producto';

  protected readonly baseQuery = `
    WITH MIS_PRODUCTOS AS (
      SELECT P.*, DP.username
      , COALESCE(json_agg(E.id_etiqueta) FILTER (WHERE E.id_etiqueta IS NOT NULL), '[]') as id_etiquetas
      , COALESCE(json_agg(E.slug_etiqueta) FILTER (WHERE E.slug_etiqueta IS NOT NULL), '[]') as etiquetas
      FROM productos P
      JOIN productores PP ON PP.id_productor=P.id_productor
      JOIN public.usuarios U ON U.id_usuario = PP.id_productor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      LEFT JOIN public.producto_etiquetas PE ON PE.id_producto=P.id_producto
      LEFT JOIN public.etiquetas E ON E.id_etiqueta = PE.id_etiqueta
      GROUP BY P.id_producto,P.id_productor, DP.id_usuario
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
