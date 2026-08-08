import { myPool } from '../../database/pool.js';

async function aceptarTransferencias() {
  console.log('Aceptando transferencias pendientes...\n');

  try {
    const res = await myPool.query(`
        UPDATE pagos
        SET estado_pago = 'APROBADO'
        WHERE estado_pago = 'PENDIENTE' 
        AND metodo_pago = 'TRANSFERENCIA';
    `);

    if (res.rowCount && res.rowCount > 0) {
      console.log(`Se aprobaron ${res.rowCount} transferencia(s).`);
    } else {
      console.log('No se encontraron transferencias pendientes para aprobar.');
    }
  } catch (error) {
    console.error('Error al aceptar las transferencias:', error);
  } finally {
    await myPool.end(); //Finalizar el pool
  }
}

aceptarTransferencias();
