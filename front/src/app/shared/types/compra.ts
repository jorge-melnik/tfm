export type ESTADO_COMPRA = 'PAGANDO' | 'PAGADO' | 'CANCELADO';
export type Compra = {
  id_compra: number;
  id_consumidor: string;
  total: string;
  estado_compra: ESTADO_COMPRA;
  direccion_envio: string;
  contacto_receptor: string;
};
export type CompraPOST = {
  direccion_envio: string;
  contacto_receptor: string;
};

export type DatosTarjeta = {
  numero: string;
  titular: string;
  vencimiento: string;
  cvv: string;
};

export type MedioPago = {
  codigo: string;
  nombre: string;
  descripcion: string;
};

export const MEDIOS_PAGO_DISPONIBLES: MedioPago[] = [
  {
    codigo: 'tarjeta-credito',
    nombre: 'Tarjeta de Crédito / Débito (Simulado)',
    descripcion: 'Aprobación instantánea en entorno local',
  },
  {
    codigo: 'transferencia',
    nombre: 'Transferencia Bancaria Directa',
    descripcion: 'Pago directo por transferencia bancaria.',
  },
];
