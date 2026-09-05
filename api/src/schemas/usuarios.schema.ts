import { Type, Static } from '@sinclair/typebox';
import { Localidad } from './departamento.schema.js';
import { RolLiteral } from './core.schemas.js';

const LIMITES_URUGUAY = {
  LAT_MIN: -35,
  LAT_MAX: -30.0,
  LON_MIN: -58.5,
  LON_MAX: -53.0,
};

export const UbicacionPost = Type.Object({
  id_localidad: Type.Integer({
    minimum: 1,
  }),
  nombre: Type.String({
    minLength: 2,
    maxLength: 32,
  }),

  direccion: Type.String({
    minLength: 3,
    maxLength: 500,
  }),

  comentarios: Type.Optional(Type.Union([Type.String({ maxLength: 500 }), Type.Null()])),

  latitud: Type.Number({
    minimum: LIMITES_URUGUAY.LAT_MIN,
    maximum: LIMITES_URUGUAY.LAT_MAX,
  }),

  longitud: Type.Number({
    minimum: LIMITES_URUGUAY.LON_MIN,
    maximum: LIMITES_URUGUAY.LON_MAX,
  }),
});
export const Ubicacion = Type.Object({
  ...UbicacionPost.properties,
  id_ubicacion: Type.Number(),
  localidad: Localidad.properties.localidad,
  departamento: Type.String(),
  ubicacion: Type.String(),
});

export type UbicacionPost = Static<typeof UbicacionPost>;
export type Ubicacion = Static<typeof Ubicacion>;

export const DatosPersonales = Type.Object(
  {
    id_usuario: Type.String({ format: 'uuid' }),
    nombres: Type.String({ maxLength: 100 }),
    apellidos: Type.String({ maxLength: 100 }),
    email: Type.String({
      format: 'email',
      maxLength: 254,
    }),
    username: Type.String({
      description: 'Nombre de usuario. Una vez seteado no se puede cambiar.',
      minLength: 5,
      maxLength: 30,
      pattern: '^[a-zA-Z0-9-]+$',
    }),
    celular: Type.String({
      pattern: '^\\+[1-9]\\d{6,14}$',
      description: 'Formato internacional E.164, ej: +59899123456',
    }),
    foto_url: Type.Optional(Type.String()),
  },
  { $id: 'datosPersonales' },
);

export const AdicionalesConsumidor = Type.Object(
  {
    // id_consumidor: Type.String({ format: 'uuid' }),
  },
  { additionalProperties: false },
);
export const AdicionalesProductor = Type.Object(
  {
    // id_productor: Type.String({ format: 'uuid' }),
    presentacion: Type.String(),
    id_ubicacion: Ubicacion.properties.id_ubicacion,
    // ubicacion: UbicacionPost,
  },
  { additionalProperties: false },
);

export const Usuario = Type.Object({
  ...DatosPersonales.properties,
  rol_actual: RolLiteral,
  roles: Type.Array(RolLiteral, { minItems: 1 }),
});

export type DatosPersonales = Static<typeof DatosPersonales>;
export type AdicionalesConsumidor = Static<typeof AdicionalesConsumidor>;
export type AdicionalesProductor = Static<typeof AdicionalesProductor>;
export type Usuario = Static<typeof DatosPersonales>;
