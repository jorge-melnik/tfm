import { PoolClient } from 'pg';

export async function aceptarTransferencias(client: PoolClient) {
  console.log('Aceptando transferencias pendientes...\n');

  const res = await client.query(`
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
}
