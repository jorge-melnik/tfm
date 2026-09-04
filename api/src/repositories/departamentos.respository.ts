import { BaseRepository } from './base.repository.js';
import { Departamento } from '@schemas/departamento.schema.js';

class DepartamentosRepositoryClass extends BaseRepository<Departamento> {
  protected readonly tableName = 'departamentos';
  protected readonly idName = 'id_departamento';
  protected readonly slugName?: keyof Departamento = 'departamento';

  protected readonly baseQuery = `
    SELECT * FROM departamentos D
    WHERE 1=1
  `;

  constructor() {
    super();
  }
}

export const departamentosRepository = new DepartamentosRepositoryClass();
