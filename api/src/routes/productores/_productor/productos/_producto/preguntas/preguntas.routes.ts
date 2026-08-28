import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { PreguntasRepository } from '@repositories/preguntas.repository.js';
import { productoRepository } from '@repositories/producto.repository.js';

import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';
import { EstadoPregunta, Pregunta, PreguntaPost } from '@schemas/pregunta.schema.js';
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
      console.log(productor, producto);
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
    handler: async function (req, reply) {
      //TODO:
      reply.code(204);
    },
  });
};

export default preguntasRoutes;
