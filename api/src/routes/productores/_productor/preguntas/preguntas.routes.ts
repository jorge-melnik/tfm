import { BadRequestError } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { PreguntasRepository } from '@repositories/preguntas.repository.js';
import { productorRepository } from '@repositories/productor.repository.js';

import { ErrorResponse, ListResponse, AppQueryString } from '@schemas/core.schemas.js';
import { EstadoPregunta, Pregunta, PreguntaPost, Respuesta } from '@schemas/pregunta.schema.js';
import { Producto } from '@schemas/producto.schema.js';

const preguntasRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'READ preguntas productor',
      description: `
        Devuelve el listado completo de preguntas de un productor. 
      `,
      params: Type.Object({
        productor: Producto.properties.productor,
      }),
      querystring: Type.Intersect([
        AppQueryString,
        Type.Object({
          estado_pregunta: Type.Optional(EstadoPregunta),
        }),
      ]),
      response: {
        200: ListResponse(Pregunta),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async function (req, reply) {
      const { productor } = req.params;
      const { username } = req.user;
      console.log({ username, productor });
      if (req.user.username != productor) throw new BadRequestError('Solo puedes acceder a tus preguntas');
    },
    handler: async (req, reply) => {
      const productor = await productorRepository.getOneBy({ username: req.params.productor }); //No aseguramos que existe el productor.
      return PreguntasRepository.getBy({
        ...req.query,
        id_productor: productor.id_productor,
      }); //Paginado
    },
  });
};

export default preguntasRoutes;
