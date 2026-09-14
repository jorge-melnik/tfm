import { ImagenProducto } from './producto';

export const EstadoPedido = {
  TODOS: 'TODOS',
  PAGANDO: 'PAGANDO',
  PAGADO: 'PAGADO',
  LISTO: 'LISTO PARA ENTREGA',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const;

export type EstadoPedidoType = (typeof EstadoPedido)[keyof typeof EstadoPedido];

export interface PedidoProducto {
  nombre: string;
  cantidad: number;
  precio: string;
  subtotal: string;
  imagenes: ImagenProducto[];
}

export interface Pedido {
  consumidor: string;
  id_productor: string;
  id_pedido: number;
  id_compra: number;
  productor: string;
  estado_pedido: EstadoPedidoType;
  subtotal_pedido: string;
  productos: PedidoProducto[];
  mensajes_no_leidos_productor: number;
  mensajes_no_leidos_consumidor: number;
  fecha_lectura_productor: string;
  fecha_lectura_consumidor: string;
  hay_no_leidos_productor: boolean;
}

export interface Mensaje {
  id_mensaje: number;
  id_pedido: number;
  id_emisor: string;
  mensaje: string;
  fecha_creacion: string;
  emisor: string; //username del emisor
}
