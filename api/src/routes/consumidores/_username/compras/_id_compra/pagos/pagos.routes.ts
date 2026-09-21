import { BadRequestError, ForbiddenError } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { comprasRepository } from '@repositories/compras.respository.js';
import { Compra, Pago, PagoTransferencia } from '@schemas/compras.schema.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { ErrorResponse } from '@schemas/core.schemas.js';
import { getProcesadorDePago } from '@services/pagos/factory.js';
import { aceptarTransferencias } from '../../../../../../scripts/simulacion/aceptar-transferencias.js';
import { myPool } from '@database/pool.js';

const rutasComprasUsername: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ pagos compra',
      description: `
        Devuelve el listado completo de pagos asociados a una compra.
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Compra.properties.id_compra,
      }),
      response: {
        200: Type.Array(Pago, { description: 'Listado de consumidores.' }),
        404: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    preHandler: async function (req, rep) {
      await comprasRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario,
      });
    },
    handler: async function (req, reply) {
      return comprasRepository.getPagos(req.params.id_compra);
    },
  });

  fastify.post('/transferencia', {
    schema: {
      tags: ['Consumidores'],
      summary: 'CREATE pago transferencia',
      description: `
        Permite registrar un pago con transferencia
      `,
      params: Type.Object({
        username: Consumidor.properties.username,
        id_compra: Compra.properties.id_compra,
      }),
      body: PagoTransferencia,
    },
    onRequest: [fastify.authenticate, fastify.selfWithRole('CONSUMIDOR')],
    preHandler: async function (req, rep) {
      const compra = await comprasRepository.getOneBy({
        id_compra: req.params.id_compra,
        id_consumidor: req.user.id_usuario, //esto ya chequea que la compra sea del usuario autenticado.
      });
      if (compra.estado_compra !== 'PAGANDO') {
        throw new ForbiddenError('La compra se encuentra en estado ' + compra.estado_compra);
      }
      if (compra.tiene_pago_pendiente) throw new BadRequestError('Compra con pago pendiente.');
      (req as any).compra = compra;
    },
    handler: async function (req, rep) {
      rep.code(201);
      const procesador = getProcesadorDePago('TRANSFERENCIA');
      const procesamiento = await procesador.procesarPago(req.body); //Simula 5s de demora.
      const compra = await comprasRepository.addPago(req.params.id_compra, {
        id_compra: req.params.id_compra,
        id_externo: procesamiento.id_externo,
        metodo_pago: 'TRANSFERENCIA',
        estado_pago: procesamiento.estadoPago,
        respuesta_raw: procesamiento.respuestaRaw,
      });
      const cliente = await myPool.connect();

      try {
        fastify.websocketServer?.clients?.forEach((cliente) => {
          cliente.send(JSON.stringify(compra));
        });
        fastify.log.info('Compra pagada a: ' + fastify.websocketServer?.clients?.size + ' clientes');
      } catch (error: any) {
        fastify.log.error('Compra pagada a: ' + fastify.websocketServer?.clients?.size + ' clientes');
      }

      try {
        await aceptarTransferencias(cliente);

        return compra;
      } catch (error: any) {
        throw error();
      } finally {
        cliente.release();
      }
    },
  });
};

export default rutasComprasUsername;
