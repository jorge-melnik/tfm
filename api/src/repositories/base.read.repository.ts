import { myPool } from '@database/pool.js';
import { BadRequestError, InternalError, NotFoundError } from '@errors/response.errors.js';
import { ListResponseType, keysCercania, keysFavoritos, keysPaginacion } from '@schemas/core.schemas.js';
import { Pool, PoolClient } from 'pg';
import { DatosBase } from '../types/datos-base.js';

/**
 * Clase Base para los repositorios.
 * En esta clase tenemos únicamente métodos que leen datos.
 */
export abstract class BaseReadRepository<T extends DatosBase> {
  protected abstract readonly baseQuery: string;
  protected abstract readonly tableName: string;
  protected abstract readonly idName: string;
  protected abstract slugName?: string;

  protected executor: PoolClient | Pool = myPool;

  /**
   * Obtenemos una copia del repositorio, pero que usará el client recibido como parámetro.
   * Esto nos permite controlar la transacción desde afuera del repository
   * @param client
   * @returns this
   */
  public withTransaction(client: PoolClient): this {
    const instance = Object.create(Object.getPrototypeOf(this)); //Copiamos la instancia actual. No queremos cambiar la "original"
    Object.assign(instance, this); //Copiamos las propiedades
    instance.executor = client;
    return instance;
  }

  /**
   * Devuelve la cantidad de filas usando tableName. No usa la baseQuery
   * @param onlyActive
   * @returns
   */
  async getCount(onlyActive: boolean | undefined = undefined): Promise<number> {
    const params = [];
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    if (onlyActive !== undefined) {
      params.push(onlyActive);
      query += ' WHERE activo=$1';
    }
    const res = await this.executor.query(query, params);
    return parseInt(res.rows[0].total, 10);
  }

  /**
   * Devuelve todos los elementos encontrados. Sin paginación ni filtrado.
   * @returns
   */
  async getAll(): Promise<T[]> {
    const res = await this.executor.query(this.baseQuery);
    return res.rows;
  }

  async getBy(routeQuery: any = {}): Promise<ListResponseType<T>> {
    const { limit, page, sort, sort_direction, latitud, longitud, distancia, id_consumidor_autenticado } =
      routeQuery;
    const filters: Partial<T> = {};
    for (const [key, value] of Object.entries(routeQuery)) {
      if (!keysPaginacion.includes(key) && !keysCercania.includes(key) && !keysFavoritos.includes(key)) {
        filters[key as keyof T] = value as any;
      }
    }

    const keys = Object.keys(filters);
    const values = Object.values(filters);

    // Construimos las condiciones solo si hay filtros
    let condiciones = '';
    if (keys.length > 0) {
      condiciones =
        ' AND ' +
        keys
          .map((key, index) => {
            const keySegura = key.replace(/[^a-zA-Z0-9_]/g, ''); //Borramos los caracteres que no son válidos en un nombre de columna.
            if (!keySegura) throw new BadRequestError('Clave de filtrado no válida'); //Si la linea anterior dejó un string vacío.

            if (keySegura === 'busqueda') {
              const textoOriginal = values[index] as string;
              values[index] = this._formatTsQuery(textoOriginal);
              return `"${keySegura}" @@ to_tsquery('spanish', $${index + 1})`; //Usamos el "Text Search Matching Operator": https://www.postgresql.org/docs/current/functions-textsearch.html
            }
            if (Array.isArray(values[index])) {
              return `"${keySegura}" && $${index + 1}::TEXT[]`; //ARRAY[1,4,3] && ARRAY[2,1] → t https://www.postgresql.org/docs/current/functions-array.html
            }
            return `"${keySegura}" = $${index + 1}`; //Entrecomillamos para que tome todo lo entrecomillado como el nombre de la columna.
          })
          .join(' AND ');
    }

    let query = `${this.baseQuery} `;

    if (latitud && longitud && distancia) {
      values.push(parseFloat(latitud), parseFloat(longitud), parseFloat(distancia));
      const idxLat = values.length - 2;
      const idxLng = values.length - 1;
      const idxRadio = values.length;
      const parteDistancia = `
          ,ST_Distance(
            UB.punto::geography,
            ST_SetSRID(ST_MakePoint($${idxLng}, $${idxLat}), 4326)::geography
          ) AS distancia
        `;
      query = query.replace('--CALCULO_DISTANCIA_AQUI', parteDistancia);
      condiciones += ' AND distancia <= $' + idxRadio;
    }

    if (id_consumidor_autenticado) {
      values.push(id_consumidor_autenticado);
      query = query.replace('--ID_CONSUMIDOR_AQUI', `$${values.length}`);
    } else {
      // Si no hay usuario (ej: endpoint público), dejamos NULL
      query = query.replace('--ID_CONSUMIDOR_AQUI', 'NULL');
    }

    query += condiciones;
    const countQuery = `SELECT COUNT(*)::INT as total FROM (${query}) AS count_query`;
    const countValues = [...values];
    let pageParseado = 1;
    let limitParseado = 10;

    if (limit && page) {
      const direction = sort_direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; //Así safamos de codigo no deseado en order direction
      const sortField = sort || this.idName;
      const safeSortField = sortField.replace(/[^a-zA-Z0-9_]/g, ''); //Eliminamos todos los caracteres que no son validos en un nombre de columna.
      query += ` ORDER BY "${safeSortField}" ${direction}`; //Entrecomillamos sortField para que lo tome como una columna y evitar código no deseado
      limitParseado = parseInt(limit.toString(), 10) || limitParseado; //Me aseguro que limit no traiga codigo no deseado
      pageParseado = parseInt(page.toString(), 10) || pageParseado; //Me aseguro que page no traiga codigo no deseado
      const offset = (pageParseado - 1) * limitParseado;
      query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limitParseado, offset);
    }
    const res = await this.executor.query(query, values);

    const countRes = await this.executor.query(countQuery, countValues);
    const totalRegistros = countRes.rows[0]?.total || 0;
    const lastPage = Math.ceil(totalRegistros / limitParseado) || 1;

    return {
      data: res.rows as T[],
      meta: {
        total: totalRegistros,
        page: pageParseado,
        limit: limitParseado,
        last_page: lastPage,
      },
    };
  }
  async getOneBy(filters: Partial<T>): Promise<T> {
    const keys = Object.keys(filters);

    if (keys.length === 0) throw new BadRequestError('No especificaste el filtro');

    const { data } = (await this.getBy({ ...filters, limit: 2, page: 1 })) as { data: T[] };
    if (data.length > 1)
      throw new InternalError('Se obtuvo más de un valor con ese filtro. Se esperaba uno.');

    if (data.length === 0) {
      throw new NotFoundError(`No existe registro con ${JSON.stringify(filters)}`);
    }
    return data[0];
  }

  async exists(id: string | number): Promise<boolean> {
    const query = `SELECT 1 FROM ${this.tableName} WHERE ${this.idName} = $1`;
    const res = await this.executor.query(query, [id]);
    return res.rows.length === 1;
  }

  /**
   * Prepara las cadenas para la busqueda avanzada
   * @param texto
   * @returns
   */
  private _formatTsQuery(texto: string): string {
    return texto
      .trim()
      .split(/\s+/) // Separa por cualquier cantidad de espacios
      .map((palabra) => `${palabra.replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ]/g, '')}:*`) // Limpia caracteres raros y agrega el prefijo :*
      .filter((p) => p !== ':*') // Evita que queden elementos vacíos si metieron símbolos
      .join(' & '); // Une cada parte con el operador AND
  }
}
