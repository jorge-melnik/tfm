import { Static, Type } from '@sinclair/typebox';

export const Departamento = Type.Object(
  {
    id_departamento: Type.Integer(),
    nombre: Type.String(),
    departamento: Type.String(),
  },
  { additionalProperties: false },
);

export const Localidad = Type.Object(
  {
    id_localidad: Type.Integer(),
    id_departamento: Type.Integer(),
    nombre: Type.String(),
    localidad: Type.String(),
  },
  { additionalProperties: false },
);

export type Departamento = Static<typeof Departamento>;
export type Localidad = Static<typeof Localidad>;
