import { BaseRepository } from './base.repository.js';
import { Departamento, Localidad } from '@schemas/departamento.schema.js';

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

  /**
   * Devuelve el listado de localidades del departamento en base a su slug o nombre
   * @param departamento
   * @returns
   */
  async getLocalidades(departamento: string): Promise<Localidad[]> {
    const query = `
        SELECT L.* 
        FROM public.localidades L 
        JOIN public.departamentos D ON D.id_departamento = L.id_departamento
        WHERE D.departamento=$1 OR D.nombre=$1
        ;
      `;
    const res = await this.executor.query(query, [departamento]);
    return res.rows;
  }
}

export const departamentosRepository = new DepartamentosRepositoryClass();
