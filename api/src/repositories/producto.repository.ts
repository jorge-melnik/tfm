import { DeAcaBadRequest, DeAcaNotFound } from '@errors/response.errors.js';
import { BaseRepository } from './base.repository.js';
import { ImagenProducto, POSTProducto, Producto } from '@schemas/producto.schema.js';

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
          json_agg(PI) FILTER (WHERE PI.path IS NOT NULL),
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
        DP.username as productor, 
        COALESCE(ME.id_etiquetas, ARRAY[]::INT[] ) AS id_etiquetas,
        COALESCE(ME.etiquetas, ARRAY[]::TEXT[] ) AS etiquetas,
        COALESCE(MF.fotos, '[]') AS fotos
        , L.localidad
        , D.departamento
        --CALCULO_DISTANCIA_AQUI
      FROM productos P 
      JOIN productores PP ON PP.id_productor = P.id_productor
      JOIN public.usuarios U ON U.id_usuario = PP.id_productor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      JOIN public.subcategorias SC ON SC.id_subcategoria = P.id_subcategoria
      JOIN public.categorias C ON C.id_categoria=SC.id_categoria
      LEFT JOIN MIS_ETIQUETAS ME ON ME.id_producto = P.id_producto
      LEFT JOIN MIS_FOTOS MF ON MF.id_producto = P.id_producto
      LEFT JOIN public.ubicaciones UB ON UB.id_ubicacion = PP.id_ubicacion
      LEFT JOIN public.localidades L ON L.id_localidad=UB.id_localidad
      LEFT JOIN public.departamentos D ON D.id_departamento = L.id_departamento
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

  override async add(data: POSTProducto): Promise<Producto> {
    const { productor, subcategoria, etiquetas, nombre, descripcion, precio, cantidad_disponible } = data;
    const producto = this.createSlug(nombre);
    const query = `
    WITH PRODUCTOR_VALIDADO AS (
      SELECT PROD.id_productor
      FROM public.productores PROD
      JOIN public.datos_personales DP ON DP.id_usuario = PROD.id_productor
      WHERE DP.username = $1
    ),
    SUBCATEGORIA_VALIDADA AS (
      SELECT id_subcategoria 
      FROM public.subcategorias 
      WHERE subcategoria = $2
    ),
    PRODUCTO_INSERTADO AS (
      INSERT INTO public.productos (
        id_productor,
        id_subcategoria,
        nombre,
        descripcion,
        precio,
        cantidad_disponible,
        producto
      )
      SELECT 
        PV.id_productor,
        SV.id_subcategoria,
        $4,$5,$6,$7,$8
      FROM PRODUCTOR_VALIDADO PV
      CROSS JOIN SUBCATEGORIA_VALIDADA SV
      RETURNING id_producto
    ),
    ID_ETIQUETAS AS (
      SELECT E.id_etiqueta, PI.id_producto --PI tiene una sola fila.
      FROM public.etiquetas E
      CROSS JOIN PRODUCTO_INSERTADO PI
      WHERE E.etiqueta = ANY($3::TEXT[])
    ),
    ETIQUETAS_INSERTADAS AS (
      INSERT INTO public.producto_etiquetas (id_producto, id_etiqueta)
      SELECT ID_E.id_producto, ID_E.id_etiqueta
      FROM ID_ETIQUETAS ID_E
    )
    SELECT id_producto FROM PRODUCTO_INSERTADO;
  `;

    const res = await this.executor.query(query, [
      productor, // $1
      subcategoria, // $2
      etiquetas, // $3
      nombre, // $4
      descripcion, // $5
      precio, // $6
      cantidad_disponible, // $7
      producto, //$8
    ]);

    if (res.rows.length === 0) {
      throw new DeAcaNotFound(`No se pudo crear el producto.`);
    }

    return this.getOneBy({ id_producto: res.rows[0].id_producto });
  }

  override async update(id_producto: number, data: POSTProducto): Promise<void> {
    const { productor, subcategoria, etiquetas, nombre, descripcion, precio, cantidad_disponible } = data;

    const query = `
      WITH PRODUCTOR_VALIDADO AS (
        SELECT id_producto
        FROM public.productos P1
        JOIN public.productores PROD ON PROD.id_productor=P1.id_productor
        JOIN public.datos_personales DP ON DP.id_usuario = PROD.id_productor
        WHERE P1.id_producto=$1 AND DP.username = $2 -- Acá ya aseguramos que coinciden id_producto con username especificado
      ),
      PRODUCTO_ACTUALIZADO AS (
        UPDATE public.productos P
        SET 
          id_subcategoria = (SELECT id_subcategoria FROM public.subcategorias WHERE subcategoria=$3),
          nombre = $5,
          descripcion = $6,
          precio = $7,
          cantidad_disponible = $8,
          fecha_actualizacion = CURRENT_TIMESTAMP
        FROM PRODUCTOR_VALIDADO PV
        WHERE P.id_producto = PV.id_producto 
        RETURNING P.id_productor, P.id_producto
      ),
      ID_ETIQUETAS AS (
        SELECT PA.id_producto, E.id_etiqueta, PE.id_etiqueta IS NOT NULL as YA_ESTA, PE.id_etiqueta IS NULL as INSERTAR
        FROM public.etiquetas E
        CROSS JOIN PRODUCTO_ACTUALIZADO PA -- solo hay uno, no genera filas extras.
        LEFT JOIN public.producto_etiquetas PE ON PE.id_producto=PA.id_producto AND PE.id_etiqueta=E.id_etiqueta
        WHERE E.etiqueta = ANY($4::TEXT[])
      ),
      ETIQUETAS_BORRADAS AS (
        DELETE FROM public.producto_etiquetas PE
        USING PRODUCTO_ACTUALIZADO PA
        WHERE PE.id_producto = PA.id_producto
        AND PE.id_etiqueta NOT IN (SELECT id_etiqueta FROM ID_ETIQUETAS) 
      ),
      ETIQUETAS_INSERTADAS AS (
        INSERT INTO public.producto_etiquetas (id_producto, id_etiqueta)
        SELECT id_producto, id_etiqueta
        FROM ID_ETIQUETAS ID_E
        WHERE INSERTAR -- ya se calculó antes si había que insertar
      )
      SELECT * FROM PRODUCTO_ACTUALIZADO
    `;

    const res = await this.executor.query(query, [
      id_producto,
      productor,
      subcategoria,
      etiquetas,
      nombre,
      descripcion,
      precio,
      cantidad_disponible,
    ]);

    if (res.rows.length === 0) {
      throw new DeAcaNotFound(`productor ${productor} con id_producto:${id_producto}`);
    }
  }

  public async updateImagenes(id_producto: number, nuevasImagenes: ImagenProducto[]): Promise<void> {
    if (nuevasImagenes.length === 0) {
      return;
    }

    const posicionesBorrar = nuevasImagenes.filter((i) => i.path == '').map((img) => img.posicion);
    const posicionesQuedan = nuevasImagenes.filter((i) => i.path != '').map((img) => img.posicion);
    const pathsQuedan = nuevasImagenes.filter((i) => i.path != '').map((img) => img.path);

    const query = `
      WITH borrar AS (
        DELETE FROM public.producto_imagenes 
        WHERE id_producto = $1
        AND posicion = ANY($2::SMALLINT[])  -- Solo borramos las posiciones que recibimos con path ''.
      )
      INSERT INTO public.producto_imagenes (id_producto, posicion, path)
      SELECT $1, i.posicion, i.path
      FROM UNNEST($3::smallint[], $4::text[]) AS i(posicion, path)
      ON CONFLICT (id_producto, posicion) 
      DO UPDATE SET path = EXCLUDED.path;
      ;
  `;

    await this.executor.query(query, [id_producto, posicionesBorrar, posicionesQuedan, pathsQuedan]);
  }
}

export const productoRepository = new ProductosRepositoryClass();
