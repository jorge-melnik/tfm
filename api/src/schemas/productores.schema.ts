import { Type, Static } from '@sinclair/typebox';
import { AdicionalesProductor, DatosPersonales } from './usuarios.schema.js';

export const Productor = Type.Object({
  id_productor: DatosPersonales.properties.id_usuario,
  ...Type.Omit(DatosPersonales, ['id_usuario']).properties,
  ...AdicionalesProductor.properties,
});

export type Productor = Static<typeof Productor>;
