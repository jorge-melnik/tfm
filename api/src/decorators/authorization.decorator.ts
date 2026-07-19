import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DeAcaForbidden } from '@errors/response.errors.js';
import { Rol } from '@schemas/auth.schema.js';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('hasAllRoles', (roles: Rol[] | Rol) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      const { user } = req;
      const rolesArray = Array.isArray(roles) ? roles : [roles];

      if (!user || !user.roles || !Array.isArray(user.roles)) {
        fastify.log.warn('El usuario no posee roles asignados en el token');
        throw new DeAcaForbidden('No tenés permisos para acceder a este recurso');
      }

      for (const rol of rolesArray) {
        if (!user.roles.includes(rol)) {
          fastify.log.warn('El usuario no tiene alguno de los roles necesarios');
          throw new DeAcaForbidden('No tenés permisos para acceder a este recurso');
        }
      }
    };
  });

  fastify.decorate('hasSomeRol', (roles: Rol[] | Rol) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      const rolesArray = Array.isArray(roles) ? roles : [roles];
      const { user } = req;

      if (!user || !user.roles || !Array.isArray(user.roles)) {
        fastify.log.warn('El usuario no posee roles asignados en el token');
        throw new DeAcaForbidden('No tenés permisos para acceder a este recurso');
      }

      let tienePermiso = false;
      for (const rol of rolesArray) {
        if (user.roles.includes(rol)) {
          tienePermiso = true;
          break;
        }
      }
      if (!tienePermiso) throw new DeAcaForbidden('No tenés permisos para acceder a este recurso');
    };
  });
});
