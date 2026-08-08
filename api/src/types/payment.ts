import { EstadoPago } from '@schemas/compras.schema.js';

export interface PaymentResult {
  exito: boolean;
  id_externo: string;
  estadoPago: EstadoPago;
  respuestaRaw: string;
  mensajeError?: string;
}

export interface PaymentProcessor {
  procesarPago(input: any): Promise<PaymentResult>;
}
