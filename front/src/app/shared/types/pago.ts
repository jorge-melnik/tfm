export type MedioPago = {
  codigo: string;
  nombre: string;
  descripcion: string;
};

export const MEDIOS_PAGO_DISPONIBLES: MedioPago[] = [
  {
    codigo: 'tarjeta-credito',
    nombre: 'Tarjeta de Crédito / Débito',
    descripcion: 'Aprobación instantánea en entorno local',
  },
  {
    codigo: 'transferencia',
    nombre: 'Transferencia Bancaria Directa',
    descripcion: 'Pago directo por transferencia bancaria.',
  },
];

export type EstadoPago = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'CANCELADO';

export interface PagoPost {
  id_compra: number;
  monto_pagado: string;
}

export interface PagoTransferencia extends PagoPost {
  banco: string;
  numero_transaccion: string;
}

export interface TarjetaSimulada extends PagoPost {
  numero_tarjeta: string;
  titular: string;
  expiracion: string;
  cvv: string;
}

export interface Pago {
  id_pago: string;
  id_compra: number;
  id_externo: string;
  metodo_pago: string;
  estado_pago: EstadoPago;
  monto_pagado: number;
  respuesta_raw: string;
  fecha_creacion: string;
  fecha_modificacion: string;
}
