import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { TSchema, Type, Static } from '@sinclair/typebox';

export const ListResponse = <T extends TSchema>(type: T) =>
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

// O si querés extraerlo 100% dinámico desde TypeBox usando Static:
type RawResponse = Static<ReturnType<typeof ListResponse>>;

export type ListResponseType<T> = {
  data: T[];
  meta: RawResponse['meta']; // Hereda automáticamente la estructura exacta de 'meta' de TypeBox
};
export const ErrorResponse = Type.Object(
  {
    statusCode: Type.Integer(),
    code: Type.Optional(Type.String()),
    error: Type.String(),
    message: Type.String(),
  },
  { $id: 'ErrorResponse' },
);

const SortDirection = Type.Union(
  [
    Type.Literal('ASC', { description: 'Orden ascendente.' }),
    Type.Literal('DESC', { description: 'Orden descendente.' }),
  ],
  {
    description:
      'Orden deseado en el resultado según el campo especificado en la propiedad "sort". ASC o DESC',
  },
);
export const RolLiteral = Type.Union(
  [
    Type.Literal('PRODUCTOR', { description: 'Rol PRODUCTOR nos permite vender productos.' }),
    Type.Literal('CONSUMIDOR', { description: 'Rol CONSUMIDOR nos permite comprar productos.' }),
    Type.Literal('ADMIN', {
      description: 'Rol ADMIN nos permite acceder a las funcionalidades de administración.',
    }),
  ],
  { description: 'Posibles roles del usuario del sistema.' },
);

export const AppQueryString = Type.Object({
  page: Type.Optional(
    Type.Integer({ minimum: 1, default: 1, description: 'Número de página que quiero obtener del total.' }),
  ),
  limit: Type.Optional(
    Type.Integer({ minimum: 1, maximum: 100, default: 10, description: 'Cantidad de "filas" por página.' }),
  ),
  sort: Type.Optional(Type.String({ description: 'Campo por el cual se esperar ordenar' })),
  sort_direction: Type.Optional(SortDirection),
});

export const keysPaginacion = ['page', 'limit', 'sort', 'sort_direction'];

export const keysCercania = ['latitud', 'longitud', 'distancia'];

export const keysFavoritos = ['id_consumidor_autenticado']; //favorito mismo entra como cualquier otra.

export type AppQueryString = Static<typeof AppQueryString>;

export default fp(async (fastify: FastifyInstance) => {
  // fastify.addSchema(ErrorResponse);
});
