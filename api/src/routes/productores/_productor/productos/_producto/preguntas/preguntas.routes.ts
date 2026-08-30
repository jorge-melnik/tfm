import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { PreguntasRepository } from '@repositories/preguntas.repository.js';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
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
        DeAcaQueryString,
        Type.Object({
          activo: Type.Optional(Type.Boolean()),
          estado_pregunta: Type.Optional(EstadoPregunta),
        }),
      ]),
      response: {
        200: DeAcaListResponse(Pregunta),
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate], //FIXME descomentar.
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
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, reply) {
      const { productor, producto } = req.params;
      const { id_producto } = req.body;
      const elProducto = await productoRepository.getOneBy({ productor, producto, id_producto }); //Nos asegura que existe el producto.
    },
    handler: async function (req, reply) {
      await PreguntasRepository.add(req.body);
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
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, reply) {
      const { productor, producto } = req.params;
      const elProducto = await productoRepository.getOneBy({ productor, producto }); //Nos asegura que existe el producto.
      const laPregunta = await PreguntasRepository.getOneBy({
        id_producto: elProducto.id_producto,
        id_pregunta: req.params.id_pregunta,
      }); //Nos aseguramos que existe la pregunta, y es del producto.
    },
    handler: async function (req, reply) {
      await PreguntasRepository.addRespuesta(req.params.id_pregunta, req.body.contenido);
      reply.code(204);
    },
  });
};

export default preguntasRoutes;
