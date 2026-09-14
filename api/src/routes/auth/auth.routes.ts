import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import authRepository from '@repositories/auth.repository.js';
import { randomUUID } from 'node:crypto';

import {
  LoginEmailSchema,
  LoginUsernameSchema,
  ProfileSchema,
  RegisterSchema,
  Rol,
  RolLiteral,
  TokenPayload,
  TokenSchema,
  User,
} from '@schemas/auth.schema.js';
import { ErrorResponse } from '@schemas/core.schemas.js';
import { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import { AdicionalesConsumidor, AdicionalesProductor } from '@schemas/usuarios.schema.js';
import { productorRepository } from '@repositories/productor.repository.js';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { BadRequestError } from '@errors/response.errors.js';

//Para manejar las mismas opciones en ambas rutas
const accessTokenOptions = {
  expiresIn: '2h',
};

const refreshTokenOptions = {
  expiresIn: '7d',
};

const refreshPath = `/${process.env.API_PREFIX || 'api'}/auth/refresh`;
const cookieOptions: CookieSerializeOptions = {
  path: refreshPath,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en prod
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
};

const authRoutes: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  async function generarTokens(payload: TokenPayload, reply: FastifyReply) {
    payload.jti = randomUUID(); //Generamos un nuevo id random
    console.log({ payload });
    const accessToken = fastify.jwt.sign(payload, accessTokenOptions);
    const refreshToken = fastify.jwt.sign(payload, refreshTokenOptions); //No importa que AT y RT tengan el mismo id, RT es de único uso.
    const user: User = fastify.jwt.decode(refreshToken) as User; //No verifica que sea válido, pero no importa, recién lo generamos
    // if (!user) throw new InternalError('Error al generar refresh token.'); //Esto es inalcanzable.

    await authRepository.addRefreshToken(user, refreshToken);

    reply.setCookie('refreshToken', refreshToken, cookieOptions);
    return { token: accessToken };
  }

  fastify.post('/login/email', {
    schema: {
      tags: ['Auth'],
      summary: 'Email login',
      description: 'Realizar login con email y contraseña.',
      body: LoginEmailSchema,
      response: {
        200: TokenSchema,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: async function (req, rep) {
      const payload = await authRepository.emailLogin(req.body.email, req.body.password);
      return generarTokens(payload, rep);
    },
  });

  fastify.post('/login/username', {
    schema: {
      tags: ['Auth'],
      summary: 'Username login',
      description: 'Realizar login con username y contraseña.',
      body: LoginUsernameSchema,
      response: {
        200: TokenSchema,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    handler: async function (req, rep) {
      const payload = await authRepository.usernameLogin(req.body.username, req.body.password);
      return generarTokens(payload, rep);
    },
  });

  fastify.get('/user', {
    schema: {
      tags: ['Auth'],
      summary: 'User Profile',
      description: 'Obtener el usuario propietario del token recibido.',
      security: [{ bearerAuth: [] }],
      response: {
        200: ProfileSchema,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      return await authRepository.getUserById(req.user.id_usuario);
    },
  });

  fastify.post('/user/productor', {
    schema: {
      tags: ['Auth'],
      summary: 'Activar Productor',
      description: 'Activar rol productor para un usuario que no lo es. Devuelve el perfil con el nuevo rol.',
      security: [{ bearerAuth: [] }],
      body: AdicionalesProductor,
      response: {
        200: ProfileSchema,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      await consumidorRepository.activarProductor(req.user.id_usuario, req.body);
      return await authRepository.getUserById(req.user.id_usuario);
    },
  });

  fastify.post('/user/consumidor', {
    schema: {
      tags: ['Auth'],
      summary: 'Activar Consumidor',
      description:
        'Activar rol consumidor para un usuario que no lo es. Devuelve el perfil con el nuevo rol.',
      security: [{ bearerAuth: [] }],
      body: AdicionalesConsumidor,
      response: {
        200: ProfileSchema,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      await productorRepository.activarConsumidor(req.user.id_usuario, req.body);
      return await authRepository.getUserById(req.user.id_usuario);
    },
  });

  fastify.put('/user/:rol', {
    schema: {
      tags: ['Auth'],
      summary: 'Cambiar a Rol',
      description: 'Cambia el rol actual para un usuario que ya tiene dicho rol asignado.',
      security: [{ bearerAuth: [] }],
      params: Type.Object({
        rol: RolLiteral,
      }),
      body: Type.Object({
        rol: RolLiteral,
      }),
      response: {
        204: Type.Null(),
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    preValidation: async (req, rep) => {
      //Paso a mayúsculas el rol de params
      if (!req.params) throw new BadRequestError('Falta params');
      if (!req.params.rol) throw new BadRequestError('Falta rol');
      const rol: Rol = req.params.rol.toUpperCase() as Rol;
      req.params.rol = rol;
    },
    preHandler: [
      fastify.matchParamsWithBody,
      async function (req, rep) {
        await fastify.hasAllRoles(req.body.rol)(req, rep);
      },
    ],
    handler: async function (req, rep) {
      rep.code(204);
      await authRepository.setRolActual(req.user.id_usuario, req.body.rol);
    },
  });

  fastify.get('/refresh', {
    schema: {
      tags: ['Auth'],
      summary: 'Refresh Token',
      description:
        'Permite obtener un nuevo access_token con un refresh token válido. A su vez, se realiza refresh token rotation.',
      response: {
        200: TokenSchema,
        401: ErrorResponse,
      },
      security: [{ cookieAuth: [] }],
    },
    onRequest: async function (req, rep) {
      try {
        await req.jwtVerify({ onlyCookie: true });
        const oldToken: any = req.cookies.refreshToken;
        await authRepository.verifyRefreshToken(req.user, oldToken);
        await authRepository.removeRefreshToken(req.user); //Si es válido una vez hay que borrarlo! Solo se usa una vez.
      } catch (error) {
        rep.clearCookie('refreshToken', cookieOptions);
        throw error;
      }
    }, //Acá debería verificar la cookie y no el header authorization.
    handler: async function (req, rep) {
      const usuarioActualizado = await authRepository.getUserById(req.user.id_usuario); //Por si cambio de roles... o algo

      return generarTokens({ ...usuarioActualizado, jti: '' }, rep);
    },
  });

  fastify.get('/logout', {
    schema: {
      summary: 'Logout',
      description: 'Hacer logout e invalidar el refresh token.',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticate],
    handler: async (req, rep) => {
      await authRepository.removeRefreshToken(req.user); //Aunque el user es del access token, el jti es el mismo.
      rep.clearCookie('refreshToken', cookieOptions);
      rep.code(204);
    },
  });

  fastify.post('/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Registrarse',
      description: `
        - Endpoint para registrar un nuevo usuario consumidor y/o productor. 
        - Si se selecciona la opción productor, se registra sin los datos de productor y al intentar vender se le pedirán los datos específicos de productor. 
        - Idem para consumidor.
        - Tampoco se solicitad foto_url al registrarse. Habrá que cambiarla a mano en otra instancia.
        - Si el registro se realiza correctamente, se devuelve un token como si hubiera hecho un login.
      `,
      body: RegisterSchema,
      response: {
        200: TokenSchema,
        401: ErrorResponse,
        500: ErrorResponse,
      },
    },
    preHandler: async function (req, rep) {
      if (!req.body.roles || req.body.roles.length === 0) {
        throw new BadRequestError('Debe seleccionar al menos un rol.');
      }
      if (!req.body.consumidor && !req.body.productor) {
        throw new BadRequestError(
          'Debes especificar los adicionales del productor y/o consumidor según corresponda.',
        );
      }
    },
    handler: async function (req, rep) {
      await authRepository.register(req.body); //Doy de alta el usuario.
      const payload = await authRepository.usernameLogin(req.body.username, req.body.password); //Lo autentico con usuario.
      const payload2 = await authRepository.emailLogin(req.body.email, req.body.password); //Lo autentico con email.

      return generarTokens(payload, rep);
    },
  });

  fastify.delete('/', {
    schema: {
      summary: 'Borrar cuenta',
      description: 'Eliminar la cuenta del usuario.',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
    },
    onRequest: [fastify.authenticate],
    handler: async (req, rep) => {
      await authRepository.borrarCuenta(req.user.id_usuario);
      rep.clearCookie('refreshToken', cookieOptions);
      rep.code(204);
    },
  });
};

export default authRoutes;
