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
      summary: 'READ compra',
      description: `
        Permite obtener una compra en específico a partir de su id.
      `,
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
      console.log({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario, //Con este dato ya nos aseguramos que la compra sea del consumidor.
      });
      return comprasRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario, //Con este dato ya nos aseguramos que la compra sea del consumidor.
      });
    },
  });

  fastify.get('/medios-de-pago', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ medios-de-pago',
      description: `
        Permite obtener el listado de medios de pago disponibles para dicha compra.
      `,
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
