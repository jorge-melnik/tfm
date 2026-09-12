import { Profile } from '@schemas/auth.schema.js';
import { BaseRepository } from './base.repository.js';
import { UbicacionPost } from '@schemas/usuarios.schema.js';
import { NotFoundError } from '@errors/response.errors.js';

export class UsuariosRepositoryClass extends BaseRepository<Profile> {
  protected readonly tableName = 'usuarios';
  protected readonly idName = 'id_usuario';
  protected readonly slugName?: string; //No ponemos acá para que no intente generarlo. Pero es el username

  protected readonly baseQuery = `
    SELECT DP.*, U.rol_actual, U.roles 
    FROM public.usuarios U
    JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
    WHERE TRUE
  `;

  constructor() {
    super();
  }

  public async getUbicaciones(id_usuario: string) {
    const consulta = `
      SELECT U.*,D.id_departamento, D.nombre as departamento, L.nombre as localidad
      FROM public.ubicaciones U
      JOIN public.localidades L ON L.id_localidad = U.id_localidad
      JOIN public.departamentos D ON D.id_departamento = L.id_departamento
      WHERE id_usuario=$1  
    `;
    const res = await this.executor.query(consulta, [id_usuario]);

    return res.rows;
  }

  public async addUbicacion(id_usuario: string, ubicacion: UbicacionPost) {
    const { nombre, direccion, id_localidad, latitud, longitud, comentarios } = ubicacion;

    const consulta = `
      INSERT INTO public.ubicaciones (
        id_usuario,
        nombre,
        direccion,
        id_localidad,
        latitud,
        longitud,
        comentarios,
        ubicacion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [
      id_usuario,
      nombre,
      direccion,
      id_localidad,
      latitud,
      longitud,
      comentarios,
      this.createSlug(nombre), //este es el ubicacion
    ];

    const res = await this.executor.query(consulta, values);

    return res.rows[0];
  }

  public async updateUbicacion(id_usuario: string, ubicacion: string, data: Partial<UbicacionPost>) {
    const { nombre, direccion, id_localidad, latitud, longitud, comentarios } = data;

    const consulta = `
      UPDATE public.ubicaciones
      SET 
        nombre = COALESCE($3, nombre),
        direccion = COALESCE($4, direccion),
        id_localidad = COALESCE($5, id_localidad),
        latitud = COALESCE($6, latitud),
        longitud = COALESCE($7, longitud),
        comentarios = COALESCE($8, comentarios),
        ubicacion = CASE WHEN $3::text IS NOT NULL THEN $9::text ELSE ubicacion END
      WHERE id_usuario = $1 AND ubicacion = $2
      RETURNING *;
    `;

    const nuevoSlug = nombre ? this.createSlug(nombre) : null;

    const values = [
      id_usuario,
      ubicacion,
      nombre ?? null,
      direccion ?? null,
      id_localidad ?? null,
      latitud ?? null,
      longitud ?? null,
      comentarios ?? null,
      nuevoSlug,
    ];

    const res = await this.executor.query(consulta, values);

    if (res.rowCount === 0) throw new NotFoundError();

    return res.rows[0];
  }

  public async removeUbicacion(id_usuario: string, ubicacion: string) {
    const consulta = `
      DELETE FROM public.ubicaciones
      WHERE id_usuario = $1 AND ubicacion = $2
      RETURNING id_ubicacion;
    `;
    const res = await this.executor.query(consulta, [id_usuario, ubicacion]);
    if (res.rowCount === 0) throw new NotFoundError();
  }
}

export const usuariosRepository = new UsuariosRepositoryClass();
