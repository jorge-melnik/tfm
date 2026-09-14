import { Static, Type } from '@sinclair/typebox';
import { Consumidor } from './consumidores.schema.js';
import { Productor } from './productores.schema.js';
import { ImagenProducto, Producto } from './producto.schema.js';

export const EstadoPedido = Type.Union(
  [
    Type.Literal('PAGANDO', { description: 'Pedido con compra en proceso de pago.' }),
    Type.Literal('PAGADO', { description: 'Pedido con compra ya finalizada y pagada.' }),
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
export const MetodosPagoSchema = Type.Union(
  [Type.Literal('TARJETA_CREDITO'), Type.Literal('TRANSFERENCIA'), Type.Literal('EFECTIVO')],
  {
    description: 'Métodos de pago permitidos en el sistema',
  },
);

export const MedioPago = Type.Object({
  codigo: Type.String(),
  nombre: Type.String(),
  descripcion: Type.String(),
});

export const CompraPOST = Type.Object({
  direccion_envio: Type.String(),
  contacto_receptor: Type.String(),
});

export const Compra = Type.Object({
  id_compra: Type.Integer(),
  id_consumidor: Consumidor.properties.id_consumidor,
  total: Type.Number(),
  estado_compra: EstadoCompra,
  tiene_pago_pendiente: Type.Boolean(),
  fecha_creacion: Type.String(),
  ...CompraPOST.properties,
});

export const PagoPost = Type.Object({
  id_compra: Type.Integer(),
  monto_pagado: Producto.properties.precio,
});

export const PagoTransferencia = Type.Object({
  banco: Type.String({ minLength: 2 }),
  numero_transaccion: Type.String({ minLength: 4 }),
  ...PagoPost.properties,
});

export const TarjetaSimulada = Type.Object({
  numero_tarjeta: Type.String(),
  titular: Type.String(),
  expiracion: Type.String(),
  cvv: Type.String(),
  ...PagoPost.properties,
});

export const Pago = Type.Object({
  id_pago: Type.String({ format: 'uuid' }),
  id_compra: Type.Integer(),
  id_externo: Type.String(),
  metodo_pago: MedioPago.properties.codigo,
  estado_pago: EstadoPago,
  monto_pagado: Producto.properties.precio,
  respuesta_raw: Type.String(),
  fecha_creacion: Type.String({ format: 'date-time' }),
  fecha_modificacion: Type.String({ format: 'date-time' }),
});

export const PedidoProducto = Type.Object({
  nombre: Producto.properties.nombre,
  cantidad: Type.Number(),
  precio: Type.String(),
  subtotal: Type.String(),
  imagenes: Type.Array(ImagenProducto),
});

export const Pedido = Type.Object({
  id_productor: Productor.properties.id_productor,
  id_consumidor: Productor.properties.id_productor,
  id_pedido: Type.Integer(),
  productor: Type.String(),
  consumidor: Type.String(),
  id_compra: Compra.properties.id_compra,
  estado_pedido: EstadoPedido,
  subtotal_pedido: Type.Number(),
  productos: Type.Array(PedidoProducto),
  fecha_lectura_productor: Type.String({ format: 'date-time' }),
  fecha_lectura_consumidor: Type.String({ format: 'date-time' }),
  mensajes_no_leidos_productor: Type.Number(),
  mensajes_no_leidos_consumidor: Type.Number(),
  hay_no_leidos_productor: Type.Boolean(),
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

export const Mensaje = Type.Object({
  id_mensaje: Type.Integer(),
  id_pedido: Pedido.properties.id_pedido,
  id_emisor: Consumidor.properties.id_consumidor,
  mensaje: Type.String(),
  fecha_creacion: Type.String({ format: 'date-time' }),

  emisor: Consumidor.properties.username,
});

export type Compra = Static<typeof Compra>;
export type CompraPOST = Static<typeof CompraPOST>;

export type MetodosPago = Static<typeof MetodosPagoSchema>;
export type Pago = Static<typeof Pago>;
export type EstadoPedido = Static<typeof EstadoPedido>;
export type Pedido = Static<typeof Pedido>;
export type ProductoPedido = Static<typeof ProductoPedido>;
export type MedioPago = Static<typeof MedioPago>;

export type EstadoPago = Static<typeof EstadoPago>;
export type PagoTransferencia = Static<typeof PagoTransferencia>;

export type Mensaje = Static<typeof Mensaje>;
