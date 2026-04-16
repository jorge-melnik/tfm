import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { TSchema, Type } from '@sinclair/typebox';

export const DeAcaListResponse = <T extends TSchema>(type: T) =>
  Type.Object({
    data: Type.Array(type, {
      description: 'Lista de elementos obtenidos según los datos especificados en request.query',
    }),
    meta: Type.Object({
      total: Type.Integer({ description: 'Total de registros en la base de datos' }),
      page: Type.Integer({ description: 'Página actual' }),
      limit: Type.Integer({ description: 'Cantidad de registros por página' }),
      last_page: Type.Integer({ description: 'Última página disponible' }),
    }),
  });

export const DeAcaErrorResponse = Type.Object(
  {
    statusCode: Type.Integer(),
    code: Type.Optional(Type.String()),
    error: Type.String(),
    message: Type.String(),
  },
  { $id: 'DeAcaErrorResponse' },
);

export const DeAcaQueryString = Type.Object({
  page: Type.Optional(
    Type.Integer({ minimum: 1, default: 1, description: 'Número de página que quiero obtener del total.' }),
  ),
  limit: Type.Optional(
    Type.Integer({ minimum: 1, maximum: 100, default: 10, description: 'Cantidad de "filas" por página.' }),
  ),
  search: Type.Optional(
    Type.String({
      maxLength: 100,
      description:
        'Término de búsqueda en formato texto para buscar con ILIKE o LIKE en columnas como nombre, descripción, etc.',
    }),
  ),
  sort: Type.Optional(Type.String({ description: 'Campo por el cual se esperar ordenar' })),
  sort_direction: Type.Optional(
    Type.Union([Type.Literal('ASC'), Type.Literal('DESC')], {
      default: 'ASC',
      description:
        'Orden deseado en el resultado según el campo especificado en la propiedad "sort". ASC o DESC',
    }),
  ),
});

export default fp(async (fastify: FastifyInstance) => {
  // fastify.addSchema(DeAcaErrorResponse);
});
