import { Static, Type } from '@sinclair/typebox';
import { Consumidor } from './consumidores.schema.js';
import { Productor } from './productores.schema.js';
import { Producto } from './producto.schema.js';

export const EstadoPedido = Type.Union(
  [
    Type.Literal('PAGANDO', { description: 'Pedido con compra en proceso de pago.' }),
    Type.Literal('PAGADA', { description: 'Pedido con compra ya finalizada y pagada.' }),
    Type.Literal('LISTO PARA ENTREGA', {
      description: 'Pedido que ya está con la compra pagada y listo para entrega.',
    }),
    Type.Literal('ENTREGADO', {
      description: 'Pedido que ya fue entregado.',
    }),
    Type.Literal('CANCELADO', {
      description: 'Pedido que su compra no se completó el pago y se canceló.',
    }),
  ],
  { description: 'Estados que puede tomar una compra. Siempre son automáticos y calculados en la BD' },
);

export const EstadoPago = Type.Union(
  [
    Type.Literal('PENDIENTE', { description: 'Pago en proceso de confirmación.' }),
    Type.Literal('APROBADO', { description: 'Pago que fue efectivamente aprobado.' }),
    Type.Literal('RECHAZADO', {
      description: 'Pago que fue rechazado.',
    }),
    Type.Literal('CANCELADO', {
      description: 'Pago que fue cancelado antes que se aprobara o rechazara. Podría ser expirado.',
    }),
  ],
  { description: 'Estados que puede tomar un pago' },
);

export const EstadoCompra = Type.Union(
  [
    Type.Literal('PAGANDO', { description: 'Compra en proceso de pago.' }),
    Type.Literal('PAGADO', { description: 'Compra ya finalizada y pagada.' }),
    Type.Literal('CANCELADA', {
      description: 'Compra que no se llegó a pagar y se canceló.',
    }),
  ],
  { description: 'Estados que puede tomar una compra. Siempre son automáticos y calculados en la BD' },
);

export const Compra = Type.Object({
  id_compra: Type.Integer(),
  id_consumidor: Consumidor.properties.id_consumidor,
  total: Type.Number(),
  estado_compra: EstadoCompra,
  direccion_envio: Type.String(),
  contacto_receptor: Type.String(),
});

export const Pago = Type.Object({
  id_pago: Type.String({ format: 'uuid' }),
  id_compra: Type.Integer(),
  id_externo: Type.String(),
  metodo_pago: Type.String(),
  estado_pago: EstadoPago,
  monto_pagado: Producto.properties.precio,
  // respuesta_raw: //Aca ver si poner String o JSONB
  fecha_creacion: Type.String({ format: 'date-time' }),
  fecha_modificacion: Type.String({ format: 'date-time' }),
});

export const Pedido = Type.Object({
  id_productor: Productor.properties.id_productor,
  id_pedido: Type.Integer(),
  id_compra: Compra.properties.id_compra,
  estado_pedido: EstadoPedido,
  subtotal_pedido: Type.Number(),
});

export const ProductoPedido = Type.Object({
  id_productor: Productor.properties.id_productor,
  id_pedido: Type.Integer(),
  id_producto: Producto.properties.id_producto,
  cantidad: Type.Integer(),
  precio_unitario: Producto.properties.precio,
  subtotal: Producto.properties.precio,
  producto: Producto.properties.nombre,
});

export type Compra = Static<typeof Compra>;
export type Pago = Static<typeof Pago>;
export type Pedido = Static<typeof Pedido>;
export type ProductoPedido = Static<typeof ProductoPedido>;
