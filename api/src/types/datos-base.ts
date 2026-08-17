import { MedioPago } from '@schemas/compras.schema.js';

export interface DatosBase {
  nombre?: string;
  username?: string;
  id_compra?: number; //Solo para que no me patee typescript
}

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
