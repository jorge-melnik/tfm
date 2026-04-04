import { myPool } from "@database/pool.js";
import type { QueryResult } from "pg";
import { AuthUser } from "../schemas/auth.schema.js";
import { UnAuthenticated } from "@errors/response.errors.js";

class AuthRepositoryClass {
  /**
   * Devuelve el usuario que tenga el email y password especificado o tira 401
   */
  async emailLogin(email: string, password: string): Promise<AuthUser> {
    const query = `
      SELECT U.id_usuario, roles 
      FROM public.usuarios U
      JOIN public.credenciales C ON C.id_usuario = U.id_usuario
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE email = $1 AND password_hash = crypt($2, C.password_hash)
    `;

    const { rows }: QueryResult<AuthUser> = await myPool.query(query, [
      email,
      password,
    ]);
    if (!rows[0] || rows.length > 1) {
      throw new UnAuthenticated();
    }
    return rows[0];
  }

  /**
   * Devuelve el usuario que tenga el usarname y password especificado o tira 401
   */
  async usernameLogin(username: string, password: string): Promise<AuthUser> {
    const query = `
      SELECT U.id_usuario, roles 
      FROM public.usuarios U
      JOIN public.credenciales C ON C.id_usuario = U.id_usuario
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE username = $1 AND password_hash = crypt($2, C.password_hash)
    `;

    const { rows }: QueryResult<AuthUser> = await myPool.query(query, [
      username,
      password,
    ]);

    if (!rows[0] || rows.length > 1) {
      throw new UnAuthenticated();
    }
    return rows[0];
  }
}

export default new AuthRepositoryClass();
