import { myPool } from '@database/pool.js';
import { aceptarTransferencias } from './aceptar-transferencias.js';

const cliente = await myPool.connect();
try {
  await aceptarTransferencias(cliente);
} catch (error: any) {
  console.error(error);
} finally {
  cliente.release();
}
