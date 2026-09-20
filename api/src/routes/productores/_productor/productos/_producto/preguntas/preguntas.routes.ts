import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { PreguntasRepository } from '@repositories/preguntas.repository.js';
import { productoRepository } from '@repositories/producto.repository.js';

import { ErrorResponse, ListResponse, AppQueryString } from '@schemas/core.schemas.js';
import { EstadoPregunta, Pregunta, PreguntaPost, Respuesta } from '@schemas/pregunta.schema.js';
import { Producto } from '@schemas/producto.schema.js';

const preguntasRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'READ preguntas producto',
      description: `
        Devuelve el listado completo de preguntas en el producto. 
      `,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      querystring: Type.Intersect([
        AppQueryString,
        Type.Object({
          activo: Type.Optional(Type.Boolean()),
          estado_pregunta: Type.Optional(EstadoPregunta),
        }),
      ]),
      response: {
        200: ListResponse(Pregunta),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async (req, reply) => {
      const { productor, producto } = req.params;
      const elProducto = await productoRepository.getOneBy({ productor, producto });
      return PreguntasRepository.getBy({
        ...req.query,
        id_producto: elProducto.id_producto,
      }); //Paginado
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'ADD pregunta',
      description: `Permite al CONSUMIDOR realizar una pregunta en un producto del PRODUCTOR.`,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
      }),
      body: PreguntaPost,
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.hasAllRoles('CONSUMIDOR')],
    preHandler: async function (req, reply) {
      const { productor, producto } = req.params;
      const { id_producto } = req.body;
      await productoRepository.getOneBy({ productor, producto, id_producto }); //Nos asegura que existe el producto.
    },
    handler: async function (req, reply) {
      const pregunta = await PreguntasRepository.add(req.body);

      try {
        fastify.log.warn('Pregunta creada a: ' + fastify.websocketServer?.clients?.size);
        fastify.websocketServer?.clients?.forEach((cliente) => {
          cliente.send(JSON.stringify(pregunta));
        });
      } catch (error: any) {
        fastify.log.error('Pregunta creada NO SE envió a: ' + fastify.websocketServer?.clients?.size);
      }
      reply.code(204);
    },
  });

  fastify.post('/:id_pregunta/respuestas', {
    schema: {
      tags: ['Productores', 'Productos'],
      summary: 'ADD respuesta',
      description: `Permite al PRODUCTOR contestar una pregunta en un producto.`,
      params: Type.Object({
        productor: Producto.properties.productor,
        producto: Producto.properties.producto,
        id_pregunta: Pregunta.properties.id_pregunta,
      }),
      body: Type.Pick(Respuesta, ['contenido']),
      response: {
        204: Type.Null(),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('PRODUCTOR')],
    preHandler: async function (req, reply) {
      const { productor, producto } = req.params;
      console.log({ productor, producto, id_pregunta: req.params.id_pregunta });
      const elProducto = await productoRepository.getOneBy({ productor, producto }); //Nos asegura que existe el producto.
      const laPregunta = await PreguntasRepository.getOneBy({
        id_producto: elProducto.id_producto,
        id_pregunta: req.params.id_pregunta,
      }); //Nos aseguramos que existe la pregunta, y es del producto.
    },
    handler: async function (req, reply) {
      const respuesta = await PreguntasRepository.addRespuesta(req.params.id_pregunta, req.body.contenido);

      try {
        fastify.log.warn('Respuesta creada a: ' + fastify.websocketServer?.clients?.size);
        fastify.websocketServer?.clients?.forEach((cliente) => {
          cliente.send(JSON.stringify(respuesta));
        });
      } catch (error: any) {
        fastify.log.error('Respuesta creada NO SE envió a: ' + fastify.websocketServer?.clients?.size);
      }
      reply.code(204);
    },
  });
};

export default preguntasRoutes;
