import { Static, Type } from '@sinclair/typebox';
import { AdicionalesConsumidor, DatosPersonales } from './usuarios.schema.js';

export const Consumidor = Type.Object({
  ...DatosPersonales.properties,
  ...AdicionalesConsumidor.properties,
});

export type Consumidor = Static<typeof Consumidor>;
