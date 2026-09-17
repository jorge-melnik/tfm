// src/services/payments/transferencia.processor.ts

import { PagoTransferencia } from '@schemas/compras.schema.js';
import { PaymentProcessor, PaymentResult } from '@types/payment.js';

export class ProcesadorTransferencia implements PaymentProcessor {
  async procesarPago(input: PagoTransferencia): Promise<PaymentResult> {
    await new Promise((resolve) => setTimeout(resolve, 2000)); //5 segundos para simular la demora.

    const { banco, numero_transaccion } = input;

    if (numero_transaccion && String(numero_transaccion).startsWith('0000')) {
      return {
        exito: false,
        id_externo: `TRANSF-MAL-${banco}-${Date.now()}`,
        estadoPago: 'RECHAZADO',
        respuestaRaw: JSON.stringify({
          motivo: 'Número de transacción inválido o no encontrado en simulación',
          datosInvocacion: input,
        }),
        mensajeError: 'No se pudo verificar la referencia de transferencia introducida.',
      };
    }

    const id_externo = `TRANSF-OK-${banco}-${Date.now()}`;

    return {
      exito: true,
      id_externo,
      estadoPago: 'PENDIENTE',
      respuestaRaw: JSON.stringify({
        banco,
        timestamp: new Date().toISOString(),
        instrucciones:
          'Transferencia registrada correctamente. Pendiente de verificación por parte del sistema.',
      }),
    };
  }
}
