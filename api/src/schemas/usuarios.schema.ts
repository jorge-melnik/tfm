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
      minLength: 5,
      maxLength: 30,
      pattern: '^[a-zA-Z0-9._]+$',
    }),
    celular: Type.String({
      pattern: '^\\+[1-9]\\d{6,14}$',
      description: 'Formato internacional E.164, ej: +59899123456',
    }),
    foto_url: Type.String({ format: 'uri' }),
  },
  { $id: 'datosPersonales' },
);

export type DatosPersonales = Static<typeof DatosPersonales>;
