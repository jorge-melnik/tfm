import { Type, Static } from '@sinclair/typebox';
import {
  AdicionalesConsumidor,
  AdicionalesProductor,
  Consumidor,
  DatosPersonales,
  Productor,
} from './usuarios.schema.js';

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

export const RegisterSchema = Type.Intersect(
  [
    Type.Omit(DatosPersonales, ['id_usuario', 'foto_url']),
    Type.Object({
      password: Type.String({
        minLength: 10,
        maxLength: 32,
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$',
        description:
          'Contraseña para iniciar sesión con email/username. Debe contener al menos una mayúscula, una minúscula y un número.',
      }),
      password2: Type.String(),
      roles: UserSchema.properties.roles,
      //Consumidor y productor debe coincidir con lo especificado en el rol
      consumidor: Type.Optional(Type.Omit(AdicionalesConsumidor, ['id_consumidor'])),
      productor: Type.Optional(Type.Omit(AdicionalesProductor, ['id_productor'])),
    }),
  ],
  {
    examples: [
      {
        nombres: 'Nombres consumidor1',
        apellidos: 'Apellidos consumidor1',
        email: 'consumidor1@gmail.com',
        username: 'consumidor1',
        celular: '+59893212122',
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['CONSUMIDOR'],
        consumidor: {},
      },
      {
        nombres: 'Nombres productor1',
        apellidos: 'Apellidos productor1',
        email: 'productor1@gmail.com',
        username: 'productor1',
        celular: '+59898323211',
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['PRODUCTOR'],
        productor: {
          presentacion: 'Soy un productor produciendo.',
        },
      },
      {
        nombres: 'Nombres productorConsumidor1',
        apellidos: 'Apellidos productorConsumidor1',
        email: 'productorConsumidor1@gmail.com',
        username: 'productorConsumidor1',
        celular: '+59898323232',
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['CONSUMIDOR', 'PRODUCTOR'],
        consumidor: {},
        productor: {
          presentacion: 'Soy un productor produciendo.',
        },
      },
    ],
  },
);

export type LoginEmailType = Static<typeof LoginEmailSchema>;
export type LoginUsernameType = Static<typeof LoginUsernameSchema>;
export type TokenPayload = Static<typeof TokenPayloadSchema>;
export type User = Static<typeof UserSchema>;
export type Profile = Static<typeof ProfileSchema>;
export type Token = Static<typeof TokenSchema>;
export type RegisterSchema = Static<typeof RegisterSchema>;

export type Rol = Static<typeof RolLiteral>;

// export default fp(async (fastify: FastifyInstance) => {
//   fastify.addSchema(LoginEmailSchema);
//   fastify.addSchema(LoginUsernameSchema);
//   fastify.addSchema(TokenSchema);
//   fastify.addSchema(AuthUserSchema);
//   fastify.addSchema(UserSchema);
// });
