import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import { comprasRepository } from '@repositories/compras.respository.js';
import { Compra, CompraPOST } from '@schemas/compras.schema.js';
import { Consumidor } from '@schemas/consumidores.schema.js';
import { DeAcaErrorResponse, DeAcaListResponse, DeAcaQueryString } from '@schemas/core.schemas.js';

const rutasComprasUsername: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.get('/', {
    schema: {
      tags: ['Consumidores'],
      summary: 'READ compras consumidor',
      description: `
        Devuelve el listado completo de compras de un consumidor.
      `,
      params: Type.Object({ username: Consumidor.properties.username }),

      querystring: DeAcaQueryString,
      response: {
        200: DeAcaListResponse(Compra),
        500: DeAcaErrorResponse,
      },
    },
    // onRequest : //FIXME: Solo para admin.
    handler: async function (req, reply) {
      //FIXME: Eventualmente esto no conviene que devuelva TODO. paginar.
      return comprasRepository.getBy({ username: req.params.username });
    },
  });

  //POST /, crea nueva compra y eliminar el carrito
  //body: direccion_envio y contacto_receptor

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
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      rep.code(201);
      const compraCreada: Compra = await comprasRepository.createFromCarrito(req.user.id_usuario, req.body);
      //TODO: Dar de alta la compra con los datos del carrito y retornarla.
      //TODO: Si no hay productos en el carrito se retorna error.
      return comprasRepository.getOneBy({ id_compra: compraCreada.id_compra });
    },
  });
};

export default rutasComprasUsername;
