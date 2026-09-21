import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { comprasRepository } from '@repositories/compras.respository.js';
import { Compra, CompraPOST } from '@schemas/compras.schema.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { ErrorResponse, ListResponse, AppQueryString } from '@schemas/core.schemas.js';

const rutasComprasUsername: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ compras consumidor',
      description: `
        Devuelve el listado completo de compras de un consumidor.
      `,
      params: Type.Object({ username: Consumidor.properties.username }),

      querystring: Type.Intersect([AppQueryString, Type.Object({})]),
      response: {
        200: ListResponse(Compra),
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async function (req, reply) {
      return comprasRepository.getBy({ username: req.params.username, ...req.query });
    },
  });

  fastify.post('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'CREATE compra',
      description: `
        Permite crear una nueva compra asociada al consumidor con el username especificado en base a los productos que se encuentran actualmente en el carrito.
      `,
      params: Type.Object({ username: Consumidor.properties.username }),
      body: CompraPOST,
      response: {
        201: Compra,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    handler: async function (req, rep) {
      rep.code(201);
      const compraCreada: Compra = await comprasRepository.createFromCarrito(req.user.id_usuario, req.body);

      try {
        fastify.log.warn('Compra creada a: ' + fastify.websocketServer?.clients?.size);
        fastify.websocketServer?.clients?.forEach((cliente) => {
          cliente.send(JSON.stringify(compraCreada));
        });
      } catch (error: any) {
        fastify.log.error('Compra creada NO SE envió a: ' + fastify.websocketServer?.clients?.size);
      }
      return comprasRepository.getOneBy({ id_compra: compraCreada.id_compra });
    },
  });
};

export default rutasComprasUsername;
