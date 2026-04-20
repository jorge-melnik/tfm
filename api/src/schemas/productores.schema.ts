import { Type, Static } from '@sinclair/typebox';
import { AdicionalesProductor, DatosPersonales } from './usuarios.schema.js';

export const Productor = Type.Object({
  ...DatosPersonales.properties,
  ...AdicionalesProductor.properties,
});

export type Productor = Static<typeof Productor>;
