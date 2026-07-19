import { DatosPersonales } from '@schemas/usuarios.schema.js';
import { BaseRepository } from './base.repository.js';

export class DatosPersonalessRepositoryClass extends BaseRepository<DatosPersonales> {
  protected readonly tableName = 'datos_personales';
  protected readonly idName = 'id_usuario';
  protected readonly slugName?: keyof DatosPersonales = 'username'; //Esto ya me va a controlar que no se cambie username

  protected readonly baseQuery = `
    SELECT * FROM datos_personales
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const datosPersonalesRepository = new DatosPersonalessRepositoryClass();
