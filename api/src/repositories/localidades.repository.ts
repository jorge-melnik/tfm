import { Localidad } from '@schemas/departamento.schema.js';
import { BaseRepository } from './base.repository.js';

class LocalidadsRepositoryClass extends BaseRepository<Localidad> {
  protected readonly tableName = 'localidades';
  protected readonly idName = 'id_localidad';
  protected readonly slugName?: keyof Localidad = 'localidad';

  protected readonly baseQuery = `
    WITH MIS_LOCALIDADES AS (
      SELECT L.*, D.departamento
      FROM public.localidades L 
      JOIN public.departamentos D ON D.id_departamento = L.id_departamento
      WHERE D.departamento=$1 OR D.nombre=$1
    )
    SELECT * FROM MIS_LOCALIDADES
    WHERE TRUE
  `;

  constructor() {
    super();
  }
}

export const localidadesRepository = new LocalidadsRepositoryClass();
