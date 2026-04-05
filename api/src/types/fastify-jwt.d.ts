import '@fastify/jwt';
import { AuthUser, User } from '@schemas/auth.schema.ts';

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{
    namespace: 'security';
  }> {}
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AuthUser;
    user: User;
  }
}
