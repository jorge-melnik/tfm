import { myPool } from '@database/pool.js';
import type { QueryResult } from 'pg';
import {
  DeAcaInternal,
  DeAcaNotAuthorized,
  DeAcaNotFound,
  DeAcaUnAuthenticated,
} from '@errors/response.errors.js';
import { Profile, TokenPayload, User } from '@schemas/auth.schema.js';

class AuthRepositoryClass {
  /**
   * Devuelve el usuario que tenga el email y password especificado o tira 401
   */
  async emailLogin(email: string, password: string): Promise<TokenPayload> {
    const query = `
      SELECT U.id_usuario, roles 
      FROM public.usuarios U
      JOIN public.credenciales C ON C.id_usuario = U.id_usuario
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE email = $1 AND password_hash = crypt($2, C.password_hash)
    `;

    const { rows }: QueryResult<TokenPayload> = await myPool.query(query, [email, password]);
    if (!rows[0] || rows.length > 1) {
      throw new DeAcaUnAuthenticated();
    }
    return rows[0];
  }

  /**
   * Devuelve el usuario que tenga el usarname y password especificado o tira 401
   */
  async usernameLogin(username: string, password: string): Promise<TokenPayload> {
    const query = `
      SELECT U.id_usuario, roles 
      FROM public.usuarios U
      JOIN public.credenciales C ON C.id_usuario = U.id_usuario
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE username = $1 AND password_hash = crypt($2, C.password_hash)
    `;

    const { rows }: QueryResult<TokenPayload> = await myPool.query(query, [username, password]);

    if (!rows[0] || rows.length > 1) {
      throw new DeAcaUnAuthenticated();
    }
    return rows[0];
  }

  /**
   * Devuelve los datos el usuario con el id_usuario especificado
   */
  async getUserById(id_usuario: string): Promise<Profile> {
    const query = `
      SELECT DP.*, to_jsonb(U.roles) as roles, U.rol_actual
      FROM public.usuarios U
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE U.id_usuario=$1
    `;

    const { rows }: QueryResult<Profile> = await myPool.query(query, [id_usuario]);
    if (rows.length === 0) {
      throw new DeAcaNotFound('Usuario con id_usuario ' + id_usuario);
    }
    if (rows.length > 1) {
      throw new DeAcaInternal('Usuario duplicado');
    }
    return rows[0];
  }

  async verifyRefreshToken(decoded: User, encoded: string) {
    const query = `
      SELECT jti,id_usuario 
      FROM public.refresh_tokens 
      WHERE jti=$1::UUID 
      AND id_usuario=$2::UUID 
      AND token_hash = digest($3::TEXT, 'sha512')::TEXT
    `;
    const { rows }: QueryResult<Profile> = await myPool.query(query, [
      decoded.jti,
      decoded.id_usuario,
      encoded,
    ]);

    //TODO: Si no existe refresh token, hay que borrar todas las sesiones por seguridad
    if (rows.length === 0) throw new DeAcaNotAuthorized('Se uso un RT válido pero inexistente');
  }

  /**
   * Agregar un nuevo refresh token valido asociado al usuario.
   */
  async addRefreshToken(decoded: User, encoded: string) {
    const expiresAt = new Date(decoded.exp * 1000);
    // const createdAt = new Date(decoded.iat * 1000);
    const query = `
      INSERT INTO public.refresh_tokens (jti,id_usuario,token_hash, expires_at)
      VALUES($1,$2,digest($3, 'sha512'),$4)
    `;
    await myPool.query(query, [decoded.jti, decoded.id_usuario, encoded, expiresAt]);
  }

  /**
   * Borrar un refresh token en base a su jti.
   */
  async removeRefreshToken(decoded: User) {
    const query = `
      DELETE FROM public.refresh_tokens 
      WHERE jti=$1
      -- no es necesario incluir el usuario.
    `;
    await myPool.query(query, [decoded.jti]);
  }
}

export default new AuthRepositoryClass();
