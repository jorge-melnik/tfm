import { Type, Static } from '@sinclair/typebox';

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
    foto_url: Type.Optional(Type.String({ format: 'uri' })),
  },
  { $id: 'datosPersonales' },
);

export const AdicionalesConsumidor = Type.Object({});
export const AdicionalesProductor = Type.Object({});

export const Consumidor = Type.Object({
  ...DatosPersonales.properties,
  ...AdicionalesConsumidor.properties,
});

export const Productor = Type.Object({
  ...DatosPersonales.properties,
  ...AdicionalesProductor.properties,
});

export type DatosPersonales = Static<typeof DatosPersonales>;
export type Consumidor = Static<typeof Consumidor>;
export type AdicionalesConsumidor = Static<typeof AdicionalesConsumidor>;
export type Productor = Static<typeof Productor>;
export type AdicionalesProductor = Static<typeof AdicionalesProductor>;
