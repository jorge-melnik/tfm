import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { departamentosRepository } from '@repositories/departamentos.respository.js';
import { localidadesRepository } from '@repositories/localidades.repository.js';
import { Localidad } from '@schemas/departamento.schema.js';
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

  fastify.get('/:departamento', {
    schema: {
      tags: ['Departamentos'],
      summary: 'READ departamento',
      description: `
        Devuelve el listado de departamentos
      `,
      params: Type.Object({ departamento: Type.String() }),
    },
    handler: async function (req, reply) {
      return await departamentosRepository.getOneBy({
        departamento: departamentosRepository.createSlug(req.params.departamento),
      });
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
      const res = await localidadesRepository.getBy({ departamento: req.params.departamento });
      return res.data; //SIN PAGINAR
    },
  });

  fastify.get('/:departamento/localidades/:localidad', {
    schema: {
      tags: ['Departamentos'],
      summary: 'READ localidades',
      description: `
        Devuelve el listado de localidades del departamento especificado
      `,
      params: Type.Object({
        departamento: Localidad.properties.departamento,
        localidad: Localidad.properties.localidad,
      }),
    },
    handler: async function (req, reply) {
      const { departamento, localidad } = req.params;

      return localidadesRepository.getOneBy({
        departamento: departamentosRepository.createSlug(departamento),
        localidad: localidadesRepository.createSlug(localidad),
      });
    },
  });
};

export default rutasUsuarios;
