import { DeAcaInternal, DeAcaUnAuthenticated } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';
import authRepository from '@repositories/auth.repository.js';
import { randomUUID } from 'node:crypto';

import {
  LoginEmailSchema,
  LoginUsernameSchema,
  ProfileSchema,
  RegisterSchema,
  TokenPayload,
  TokenSchema,
  User,
} from '@schemas/auth.schema.js';
import { DeAcaErrorResponse } from '@schemas/core.schemas.js';
import { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import { AdicionalesConsumidor, AdicionalesProductor } from '@schemas/usuarios.schema.js';

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
    const accessToken = fastify.jwt.sign(payload, accessTokenOptions);
    const refreshToken = fastify.jwt.sign(payload, refreshTokenOptions); //No importa que AT y RT tengan el mismo id, RT es de único uso.
    const user: User = fastify.jwt.decode(refreshToken) as User; //No verifica, pero no importa.
    // if (!user) throw new DeAcaInternal('Error al generar refresh token.'); //Esto es inalcanzable.

    await authRepository.addRefreshToken(user, refreshToken);

    reply.setCookie('refreshToken', refreshToken, cookieOptions);
    return { token: accessToken };
  }

  fastify.post('/login/email', {
    schema: {
      tags: ['auth'],
      summary: 'Email login',
      description: 'Realizar login con email y contraseña.',
      body: LoginEmailSchema,
      response: {
        200: TokenSchema,
        401: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, rep) {
      const payload = await authRepository.emailLogin(req.body.email, req.body.password);
      return generarTokens(payload, rep);
    },
  });

  fastify.post('/login/username', {
    schema: {
      tags: ['auth'],
      summary: 'Username login',
      description: 'Realizar login con username y contraseña.',
      body: LoginUsernameSchema,
      response: {
        200: TokenSchema,
        401: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    handler: async function (req, rep) {
      const payload = await authRepository.usernameLogin(req.body.username, req.body.password);
      return generarTokens(payload, rep);
    },
  });

  fastify.get('/user', {
    schema: {
      tags: ['auth'],
      summary: 'User Profile',
      description: 'Obtener el usuario propietario del token recibido.',
      security: [{ bearerAuth: [] }],
      response: {
        200: ProfileSchema,
        401: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      return await authRepository.getUserById(req.user.id_usuario);
    },
  });

  fastify.post('/user/productor', {
    schema: {
      tags: ['auth'],
      summary: 'Activar Productor',
      description: 'Activar rol productor para un usuario que no lo es. Devuelve el perfil con el nuevo rol.',
      security: [{ bearerAuth: [] }],
      body: AdicionalesProductor,
      response: {
        200: ProfileSchema,
        401: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      await authRepository.activarProductor(req.user.id_usuario, req.body);
      return await authRepository.getUserById(req.user.id_usuario);
    },
  });

  fastify.post('/user/consumidor', {
    schema: {
      tags: ['auth'],
      summary: 'Activar Consumidor',
      description:
        'Activar rol consumidor para un usuario que no lo es. Devuelve el perfil con el nuevo rol.',
      security: [{ bearerAuth: [] }],
      body: AdicionalesConsumidor,
      response: {
        200: ProfileSchema,
        401: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
      await authRepository.activarConsumidor(req.user.id_usuario, req.body);
      return await authRepository.getUserById(req.user.id_usuario);
    },
  });

  fastify.post('/refresh', {
    schema: {
      tags: ['auth'],
      summary: 'Refresh Token',
      description:
        'Permite obtener un nuevo access_token con un refresh token válido. A su vez, se realiza refresh token rotation.',
      response: {
        200: TokenSchema,
        401: DeAcaErrorResponse,
      },
      security: [{ cookieAuth: [] }],
    },
    onRequest: async function (req, rep) {
      try {
        await req.jwtVerify({ onlyCookie: true });
        const oldToken = req.cookies.refreshToken || 'dsadasdlkasjdaslñk';
        fastify.log.info({ oldToken });
        await authRepository.verifyRefreshToken(req.user, oldToken);
        await authRepository.removeRefreshToken(req.user); //Si es válido una vez hay que borrarlo! Solo se usa una vez.
      } catch (error) {
        rep.clearCookie('refreshToken', cookieOptions);
        throw error;
      }
    }, //Acá debería verificar la cookie y no el header authorization.
    handler: async function (req, rep) {
      return generarTokens(req.user, rep);
    },
  });

  fastify.post('/logout', {
    schema: {
      summary: 'Logout',
      description: 'Hacer logout e invalidar el refresh token.',
      tags: ['auth'],
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
      tags: ['auth'],
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
        401: DeAcaErrorResponse,
        500: DeAcaErrorResponse,
      },
    },
    // preHandler : TODO: verificar que roles coincida con consumidor y productor
    handler: async function (req, rep) {
      await authRepository.register(req.body); //Doy de alta el usuario.
      const payload = await authRepository.emailLogin(req.body.email, req.body.password); //Lo autentico.
      return generarTokens(payload, rep);
    },
  });
};

export default authRoutes;
