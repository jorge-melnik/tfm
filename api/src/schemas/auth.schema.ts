import { Type, Static } from '@sinclair/typebox';
import { DatosPersonales } from './usuarios.schema.js';

export const RolLiteral = Type.Union(
  [
    Type.Literal('PRODUCTOR', { description: 'Rol PRODUCTOR nos permite vender productos.' }),
    Type.Literal('CONSUMIDOR', { description: 'Rol CONSUMIDOR nos permite comprar productos.' }),
    Type.Literal('ADMIN', {
      description: 'Rol ADMIN nos permite acceder a las funcionalidades de administración.',
    }),
  ],
  { description: 'Posibles roles del usuario del sistema.' },
);

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

export const TokenSchema = Type.Object(
  {
    token: Type.String({ description: 'Este es el token generado por la api.' }),
  },
  { description: 'Objeto para recibir el token cuando hacemos login.' },
);

export const TokenPayloadSchema = Type.Object({
  id_usuario: Type.String({ format: 'uuid', description: 'Id (UUID) del usuario autenticado.' }),
  jti: Type.String({ format: 'uuid', description: 'JWT Id.' }),
  roles: Type.Array(RolLiteral, {
    minItems: 1,
    description: 'Roles con los que cuenta el usuario actualmente.',
  }),
  // rol_actual: RolLiteral,
  //FIXME: Considerar si incluir rol_actual
});
export const UserSchema = Type.Object(
  {
    id_usuario: Type.String({ format: 'uuid', description: 'Id (UUID) del usuario autenticado.' }),
    jti: Type.String({ format: 'uuid', description: 'JWT Id.' }),
    roles: Type.Array(RolLiteral, {
      minItems: 1,
      description: 'Roles con los que cuenta el usuario actualmente.',
    }),
    iat: Type.Integer(),
    exp: Type.Integer(),
  },
  { description: 'Esquema para definir el usuario de req.user' },
);

export const ProfileSchema = Type.Intersect(
  [
    Type.Pick(DatosPersonales, ['id_usuario', 'username', 'foto_url']),
    Type.Object({
      rol_actual: RolLiteral,
      roles: Type.Array(RolLiteral, { minItems: 1 }),
    }),
  ],
  {
    description: 'Datos que puedo mostrar del usuario logueado en el frontend.',
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
