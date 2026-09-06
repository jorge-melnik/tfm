import { ImagenProducto } from './producto';

// export type EstadoPedido = 'PAGANDO' | 'PAGADO' | 'LISTO PARA ENTREGA' | 'ENTREGADO' | 'CANCELADO';

export const EstadoPedido = {
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
}

export interface Mensaje {
  id_mensaje: number;
  id_pedido: number;
  id_emisor: string;
  mensaje: string;
  fecha_creacion: string;
  emisor: string; //username del emisor
}
