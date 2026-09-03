import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { departamentosRepository } from '@repositories/departamentos.respository.js';
const rutasUsuarios: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Departamentos'],
      summary: 'READ departamentos',
      description: `
        Devuelve el listado de departamentos
      `,
    },
    handler: async function (req, reply) {
      return await departamentosRepository.getAll();
    },
  });

  fastify.get('/:departamento/localidades', {
    schema: {
      tags: ['Departamentos'],
      summary: 'READ localidades',
      description: `
        Devuelve el listado de localidades del departamento especificado
      `,
      params: Type.Object({ departamento: Type.String() }),
    },
    handler: async function (req, reply) {
      return await departamentosRepository.getLocalidades(req.params.departamento);
    },
  });
};

export default rutasUsuarios;
