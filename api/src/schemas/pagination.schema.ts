import { Static, Type } from '@sinclair/typebox';

const OrderDirection = Type.Union(
  [
    Type.Literal('ASC', { description: 'Orden ascendente.' }),
    Type.Literal('DESC', { description: 'Orden descendente.' }),
  ],
  {
    description: '',
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

export const PaginationOptions = Type.Object(
  {
    page: Type.Optional(
      Type.Integer({
        minimum: 1,
        default: 1,
        description: 'Número de página solicitada.',
      }),
    ),
    limit: Type.Optional(
      Type.Integer({
        minimum: 1,
        maximum: 100,
        default: 10,
        description: 'Cantidad de filas por página.',
      }),
    ),
    orderBy: Type.Optional(
      Type.String({
        description: 'Campo por el cual ordenar',
      }),
    ),
    orderDirection: Type.Optional(OrderDirection),
  },
  { description: 'Información de paginación.', additionalProperties: false },
);

export type PaginationOptions = Static<typeof PaginationOptions>;
