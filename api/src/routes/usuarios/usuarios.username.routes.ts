import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { usuariosRepository } from '@repositories/usuario.repository.js';
import { UbicacionPost, Usuario } from '@schemas/usuarios.schema.js';
const rutasUsuarios: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/:username', {
    schema: {
      tags: ['Usuarios'],
      summary: 'READ usuario',
      description: `
        Devuelve el usuario
      `,
      params: Type.Object({
        username: Usuario.properties.username,
      }),
    },
    handler: async function (req, reply) {
      const { username } = req.params;
      return await usuariosRepository.getOneBy({ username });
    },
  });

  fastify.get('/:username/ubicaciones', {
    schema: {
      tags: ['Usuarios'],
      summary: 'READ ubicaciones',
      description: `
        Devuelve las ubicaciones de un usuario
      `,
      params: Type.Object({
        username: Usuario.properties.username,
      }),
    },
    handler: async function (req, reply) {
      const { username } = req.params;
      const usuario = await usuariosRepository.getOneBy({ username });
      return await usuariosRepository.getUbicaciones(usuario.id_usuario);
    },
  });

  fastify.post('/:username/ubicaciones', {
    schema: {
      tags: ['Usuarios'],
      summary: 'POST ubicación',
      description: `
        Devuelve el usuario
      `,
      params: Type.Object({
        username: Usuario.properties.username,
      }),
      body: UbicacionPost,
    },
    handler: async function (req, reply) {
      reply.code(204);
      const { username } = req.params;
      const usuario = await usuariosRepository.getOneBy({ username });
      return await usuariosRepository.addUbicacion(usuario.id_usuario, req.body);
    },
  });
};

export default rutasUsuarios;
