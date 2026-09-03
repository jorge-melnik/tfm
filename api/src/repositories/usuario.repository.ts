import { Profile } from '@schemas/auth.schema.js';
import { BaseRepository } from './base.repository.js';
import { UbicacionPost } from '@schemas/usuarios.schema.js';

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
      SELECT U.*, D.nombre as departamento, L.nombre as localidad
      FROM public.ubicaciones U
      JOIN public.localidades L ON L.id_localidad = U.id_localidad
      JOIN public.departamentos D ON D.id_departamento = L.id_departamento
      WHERE id_usuario=$1  
    `;
    const res = await this.executor.query(consulta, [id_usuario]);

    return res.rows;
  }

  public async addUbicacion(id_usuario: string, ubicacion: UbicacionPost) {
    //TODO: dar de alta la ubicacion
    throw new Error('No implementado.');
  }
  public async removeUbicacion(id_usuario: string, id_ubicacion: number) {
    //TODO:
    throw new Error('No implementado');
  }
}

export const usuariosRepository = new UsuariosRepositoryClass();
