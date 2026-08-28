import { Pregunta } from '@schemas/pregunta.schema.js';
import { BaseRepository } from './base.repository.js';

export class PreguntasRepositoryClass extends BaseRepository<Pregunta> {
  protected readonly tableName = 'preguntas';
  protected readonly idName = 'id_pregunta';
  protected readonly slugName?: keyof Pregunta = 'id_pregunta';

  protected readonly baseQuery = `
    WITH MIS_PREGUNTAS AS (
      SELECT P.*
      , DP.username as consumidor
      , COALESCE(json_agg(R) FILTER (WHERE r.id_respuesta IS NOT NULL),'[]'::json
    ) AS respuestas
      FROM public.preguntas P
      JOIN public.usuarios U ON U.id_usuario = P.id_consumidor
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      LEFT JOIN public.respuestas R ON R.id_pregunta = P.id_pregunta
      GROUP BY P.id_pregunta, DP.username
    )
    SELECT * FROM MIS_PREGUNTAS
    WHERE true
  `;

  constructor() {
    super();
  }
}

export const PreguntasRepository = new PreguntasRepositoryClass();
