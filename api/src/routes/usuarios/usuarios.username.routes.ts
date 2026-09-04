import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { usuariosRepository } from '@repositories/usuario.repository.js';
import { Ubicacion, UbicacionPost, Usuario } from '@schemas/usuarios.schema.js';
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
      summary: 'CREATE ubicación',
      description: `
        Crea una nueva ubicación asociada al usuario.
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

  fastify.put('/:username/ubicaciones/:ubicacion', {
    schema: {
      tags: ['Usuarios'],
      summary: 'UPDATE ubicación',
      description: `
        Actualiza una ubicación del usuario
      `,
      params: Type.Object({
        username: Usuario.properties.username,
        ubicacion: Ubicacion.properties.ubicacion,
      }),
      body: UbicacionPost,
    },
    preHandler: [], //TODO: Es el mismo
    handler: async function (req, reply) {
      reply.code(204);
      const { username } = req.params;
      const usuario = await usuariosRepository.getOneBy({ username });
      return await usuariosRepository.updateUbicacion(usuario.id_usuario, req.params.ubicacion, req.body);
    },
  });

  fastify.delete('/:username/ubicaciones/:ubicacion', {
    schema: {
      tags: ['Usuarios'],
      summary: 'DELETE ubicación',
      description: `
        Borra una ubicación del usuario
      `,
      params: Type.Object({
        username: Usuario.properties.username,
        ubicacion: Ubicacion.properties.ubicacion,
      }),
      body: UbicacionPost,
    },
    preHandler: [], //TODO: Es el mismo
    handler: async function (req, reply) {
      reply.code(204);
      const { username } = req.params;
      const usuario = await usuariosRepository.getOneBy({ username });
      return await usuariosRepository.updateUbicacion(usuario.id_usuario, req.params.ubicacion, req.body);
    },
  });
};

export default rutasUsuarios;
