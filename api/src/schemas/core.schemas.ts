import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { TSchema, Type } from '@sinclair/typebox';

// export const DeAcaList = <T extends TSchema>(type: T) => Type.Object({ data: type });
export const DeAcaList = <T extends TSchema>(type: T) =>
  Type.Object({
    data: Type.Array(type),
    meta: Type.Optional(
      Type.Object({
        total: Type.Optional(Type.Number()),
        page: Type.Optional(Type.Number()),
      }),
    ),
  });

export const ErrorResponseSchema = Type.Object(
  {
    statusCode: Type.Number(),
    code: Type.Optional(Type.String()),
    error: Type.String(),
    message: Type.String(),
  },
  { $id: 'ErrorResponse' },
);

export default fp(async (fastify: FastifyInstance) => {
  // fastify.addSchema(ErrorResponseSchema);
});
