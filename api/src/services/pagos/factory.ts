import { PaymentProcessor } from '@types/payment.js';
import { MetodosPago } from '@schemas/compras.schema.js';
import { ProcesadorTransferencia } from './procesador-transferencia.js';

export function getProcesadorDePago(metodoPago: MetodosPago): PaymentProcessor {
  const metodo = metodoPago.toLowerCase();

  switch (metodo) {
    case 'transferencia':
      return new ProcesadorTransferencia();
    // case 'tarjeta_credito':
    //   return new TarjetaSimuladaProcessor();

    default:
      throw new Error(`No existe un procesador configurado para el método: ${metodoPago}`);
  }
}
