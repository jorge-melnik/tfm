import { Type, Static } from '@sinclair/typebox';
import { AdicionalesProductor, DatosPersonales, Ubicacion } from './usuarios.schema.js';

export const Productor = Type.Object({
  id_productor: DatosPersonales.properties.id_usuario,
  ...Type.Omit(DatosPersonales, ['id_usuario']).properties,
  ...AdicionalesProductor.properties,
  ubicacion: Type.Optional(Ubicacion),
});

export type Productor = Static<typeof Productor>;
