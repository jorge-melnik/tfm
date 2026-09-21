import { Pregunta } from '@schemas/pregunta.schema.js';
import { BaseRepository } from './base.repository.js';
import { NotFoundError } from '@errors/response.errors.js';

export class PreguntasRepositoryClass extends BaseRepository<Pregunta> {
  protected readonly tableName = 'preguntas';
  protected readonly idName = 'id_pregunta';
  protected readonly slugName?: keyof Pregunta = 'id_pregunta';

  protected readonly baseQuery = `
    WITH MIS_PREGUNTAS AS (
      SELECT P.*
        , PR.id_productor
        , DP.username as consumidor
        , PR.producto
        , COALESCE(json_agg(R) FILTER (WHERE r.id_respuesta IS NOT NULL),'[]'::json) AS respuestas
      FROM public.preguntas P
      JOIN public.usuarios U ON U.id_usuario = P.id_consumidor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      JOIN public.productos PR ON PR.id_producto = P.id_producto
      LEFT JOIN public.respuestas R ON R.id_pregunta = P.id_pregunta
      GROUP BY PR.id_productor,P.id_pregunta, DP.username, PR.producto
    )
    SELECT * FROM MIS_PREGUNTAS
    WHERE true
  `;

  constructor() {
    super();
  }

  async addRespuesta(id_pregunta: number, contenido: string) {
    const consulta = `
      INSERT INTO public.respuestas(id_pregunta,contenido) VALUES($1,$2)
      RETURNING *
    `;
    const res = await this.executor.query(consulta, [id_pregunta, contenido]);
    if (res.rowCount === 0) throw new NotFoundError('');
    return res.rows[0];
  }
}

export const PreguntasRepository = new PreguntasRepositoryClass();
