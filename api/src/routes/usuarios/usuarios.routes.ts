import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { usuariosRepository } from '@repositories/usuario.repository.js';
import { AppQueryString } from '@schemas/core.schemas.js';
const rutasUsuarios: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Usuarios'],
      summary: 'READ usuarios',
      description: `
        Devuelve el listado de usuarios
      `,
      querystring: Type.Intersect([
        AppQueryString,
        Type.Object({
          username: Type.Optional(Type.String()),
          id_usuario: Type.Optional(Type.String()),
        }),
      ]),
    },
    handler: async function (req, reply) {
      return await usuariosRepository.getBy();
    },
  });
};

export default rutasUsuarios;
