import { DeAcaInternal, DeAcaUnAuthenticated } from '@errors/response.errors.js';
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import authRepository from '@repositories/auth.repository.js';
import { randomUUID } from 'node:crypto';

import {
  LoginEmailSchema,
  LoginUsernameSchema,
  ProfileSchema,
  TokenPayload,
  TokenSchema,
  User,
} from '@schemas/auth.schema.js';
import { ErrorResponseSchema } from '@schemas/core.schemas.js';
import { FastifyReply } from 'fastify';

//Para manejar las mismas opciones en ambas rutas
const accessTokenOptions = {
  expiresIn: '2h',
};

const refreshTokenOptions = {
  expiresIn: '7d',
};

const refreshPath = `/${process.env.API_PREFIX || 'api'}/auth/refresh`;

const root: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  async function generarTokens(payload: TokenPayload, reply: FastifyReply) {
    payload.jti = randomUUID(); //Generamos un nuevo id random
    const accessToken = fastify.jwt.sign(payload, accessTokenOptions);
    const refreshToken = fastify.jwt.sign(payload, refreshTokenOptions); //No importa que AT y RT tengan el mismo id, RT es de único uso.
    const user: User = fastify.jwt.decode(refreshToken) as User; //No verifica, pero no importa.
    if (!user) throw new DeAcaInternal('Error al generar refresh token.');

    await authRepository.addRefreshToken(user, refreshToken);

    reply.setCookie('refreshToken', refreshToken, {
      path: refreshPath,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en prod
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    });
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
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
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
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    handler: async function (req, rep: FastifyReply) {
      const payload = await authRepository.usernameLogin(req.body.username, req.body.password);
      return generarTokens(payload, rep);
    },
  });

  fastify.get('/profile', {
    schema: {
      tags: ['auth'],
      summary: 'User Profile',
      description: 'Obtener el usuario propietario del token recibido.',
      security: [{ bearerAuth: [] }],
      response: {
        200: ProfileSchema,
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (req, rep) {
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
        401: ErrorResponseSchema,
      },
    },
    onRequest: async function (req, rep) {
      try {
        await req.jwtVerify({ onlyCookie: true });
        const oldToken = req.cookies.refreshToken;
        if (!oldToken) throw new DeAcaUnAuthenticated('No hay refresh token.');
        await authRepository.verifyRefreshToken(req.user, oldToken);
        await authRepository.removeRefreshToken(req.user); //Si es válido una vez hay que borrarlo! Solo se usa una vez.
      } catch (error) {
        rep.setCookie('refreshToken', '', {
          domain: process.env.FASTIFY_HOST || 'localhost',
          path: refreshPath,
          secure: true,
          httpOnly: true,
          sameSite: 'lax',
        });
        throw error;
      }
    }, //Acá debería verificar la cookie y no el header authorization.
    handler: async function (req, rep) {
      //Si llegué acá es porque el refreshToken existe y es valido
      const oldToken = req.cookies.refreshToken;
      if (!oldToken) {
        throw new DeAcaUnAuthenticated('No hay refresh token.');
      }
      return generarTokens(req.user, rep);
    },
  });

  // fastify.post('/logout', async (req, rep) => {
  //   const token = req.cookies.refreshToken;
  //   if (token) {
  //     const decoded: any = fastify.jwt.decode(token);
  //     await authRepository.consumeRefreshToken(decoded.id_usuario, token);
  //   }
  //   rep.clearCookie('refreshToken');
  //   return { message: 'Sesión cerrada' };
  // });
};

export default root;
