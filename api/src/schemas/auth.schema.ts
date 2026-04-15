import { Type, Static } from '@sinclair/typebox';
import { DatosPersonales } from './usuarios.schema.js';

export const RolLiteral = Type.Union([
  Type.Literal('PRODUCTOR'),
  Type.Literal('CONSUMIDOR'),
  Type.Literal('ADMIN'),
]);

export const LoginSchema = Type.Object({
  username: Type.String({}),
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});

export const LoginEmailSchema = Type.Omit(LoginSchema, ['username'], {
  $id: 'LoginEmail',
  examples: [
    {
      email: 'admin@deaca.com',
      password: 'Contraseña',
    },
    {
      email: 'productor@deaca.com',
      password: 'Contraseña',
    },
    {
      email: 'consumidor@deaca.com',
      password: 'Contraseña',
    },
  ],
});

export const LoginUsernameSchema = Type.Omit(LoginSchema, ['email'], {
  $id: 'LoginUsername',
  examples: [
    {
      username: 'admin',
      password: 'Contraseña',
    },
    {
      username: 'productor',
      password: 'Contraseña',
    },
    {
      username: 'consumidor',
      password: 'Contraseña',
    },
  ],
});

export const TokenSchema = Type.Object({
  token: Type.String(),
});

export const TokenPayloadSchema = Type.Object({
  id_usuario: Type.String({ format: 'uuid' }),
  jti: Type.String({ format: 'uuid' }),
  roles: Type.Array(RolLiteral, { minItems: 1 }),
});
export const UserSchema = Type.Object({
  id_usuario: Type.String({ format: 'uuid' }),
  jti: Type.String({ format: 'uuid' }),
  roles: Type.Array(RolLiteral, { minItems: 1 }),
  iat: Type.Integer(),
  exp: Type.Integer(),
});

export const ProfileSchema = Type.Intersect(
  [
    Type.Pick(DatosPersonales, ['id_usuario', 'username', 'foto_url']),
    Type.Object({
      rol_actual: RolLiteral,
      roles: Type.Array(RolLiteral, { minItems: 1 }),
    }),
  ],
  {
    description: 'Datos que puedo mostrar del usuario logueado.',
  },
);

export type LoginEmailType = Static<typeof LoginEmailSchema>;
export type LoginUsernameType = Static<typeof LoginUsernameSchema>;
export type TokenPayload = Static<typeof TokenPayloadSchema>;
export type User = Static<typeof UserSchema>;
export type Profile = Static<typeof ProfileSchema>;
export type Token = Static<typeof TokenSchema>;

export type Rol = Static<typeof RolLiteral>;

// export default fp(async (fastify: FastifyInstance) => {
//   fastify.addSchema(LoginEmailSchema);
//   fastify.addSchema(LoginUsernameSchema);
//   fastify.addSchema(TokenSchema);
//   fastify.addSchema(AuthUserSchema);
//   fastify.addSchema(UserSchema);
// });
