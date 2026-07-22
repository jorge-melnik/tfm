import '@fastify/jwt';
import { TokenPayload, TokenPayloadSchema, User } from '@schemas/auth.schema.ts';

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{
    namespace: 'security';
  }> {}
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: TokenPayload;
    user: User;
  }
}
