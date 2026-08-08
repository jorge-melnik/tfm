import { DeAcaForbidden } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { comprasRepository } from '@repositories/compras.respository.js';
import { Compra, MedioPago } from '@schemas/compras.schema.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { MEDIOS_PAGO_DISPONIBLES } from '@types/datos-base.js';

const idCompraRoutes: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Compra.properties.id_compra,
      }),
      response: {
        200: Compra,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      return comprasRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario, //Con este dato ya nos aseguramos que la compra sea del consumidor.
      });
    },
  });

  fastify.get('/medios-de-pago', {
    schema: {
      tags: ['Consumidores'],
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Compra.properties.id_compra,
      }),
      response: {
        200: Type.Array(MedioPago),
      },
    },
    onRequest: [fastify.authenticate],
    preHandler: async function (req, rep) {
      const compra: Compra = await comprasRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario, //Con este dato ya nos aseguramos que la compra sea del consumidor.
      });
      if (compra.estado_compra !== 'PAGANDO')
        throw new DeAcaForbidden('La compra está en estado ' + compra.estado_compra);
    },
    handler: async function (req, rep) {
      return MEDIOS_PAGO_DISPONIBLES;
    },
  });
};

export default idCompraRoutes;
