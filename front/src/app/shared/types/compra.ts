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
