import { myPool } from '@database/pool.js';
import type { Client, PoolClient, QueryResult } from 'pg';
import {
  DeAcaBadRequest,
  DeAcaInternal,
  DeAcaNotFound,
  DeAcaUnAuthenticated,
} from '@errors/response.errors.js';
import { Profile, RegisterSchema, Rol, TokenPayload, User } from '@schemas/auth.schema.js';
import { AdicionalesConsumidor, AdicionalesProductor } from '@schemas/usuarios.schema.js';

class AuthRepositoryClass {
  /**
   * Devuelve el usuario que tenga el email y password especificado o tira 401
   */
  async emailLogin(email: string, password: string): Promise<TokenPayload> {
    const query = `
      SELECT U.id_usuario, to_jsonb(roles) as roles 
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
      SELECT U.id_usuario, to_jsonb(roles) as roles 
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
    if (rows.length === 0) throw new DeAcaUnAuthenticated('RT no valido.');
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

  /**
   * Registrar un nuevo usuario como consumidor y/o productor.
   * @param dp
   */
  async register(dp: RegisterSchema): Promise<void> {
    if (dp.roles.length <= 0) throw new DeAcaBadRequest('Debes especificar al menos un rol.');
    const queryUsuario = 'INSERT INTO usuarios (rol_actual, roles) VALUES ($1, $2) RETURNING *';
    const queryDatosPersonales = `
        INSERT INTO datos_personales (id_usuario, nombres, apellidos, email, username,celular) VALUES ($1, $2, $3, $4,$5, $6);
      `;
    const client = await myPool.connect(); //Obtenemos un cliente para poder hacer una transacción
    try {
      await client.query('BEGIN;');
      //Primero crear el usuario
      const { rows: rows }: QueryResult<{ id_usuario: string }> = await client.query(queryUsuario, [
        dp.roles[0],
        dp.roles,
      ]);
      const { id_usuario } = rows[0]; //Tengo el id_usuario creado
      //Segundo guardar datos personales.
      await client.query(queryDatosPersonales, [
        id_usuario,
        dp.nombres,
        dp.apellidos,
        dp.email,
        dp.username,
        dp.celular,
      ]);

      if (dp.consumidor) await this.activarConsumidor(id_usuario, dp.consumidor, client);
      if (dp.productor) await this.activarProductor(id_usuario, dp.productor, client);

      //Insertar credenciales
      const credencialesQuery = `
        INSERT INTO credenciales (id_usuario, password_hash) 
        VALUES ($1, crypt($2, gen_salt('bf', 10)))
        ;
      `;
      await client.query(credencialesQuery, [id_usuario, dp.password]);

      await client.query('COMMIT;'); //Confirmar transacción
    } catch (error: any) {
      await client.query('ROLLBACK;');
      throw new DeAcaInternal(error.message);
    } finally {
      client.release();
    }
  }

  /**
   * Activar rol consumidor para un usuario ya existente que aún no lo tiene.
   * @param id_usuario
   * @param consumidor
   * @param client Se puede pasar un client si hay que ejecutarlo en la misma transacción. Caso register
   */
  async activarConsumidor(id_usuario: string, consumidor: AdicionalesConsumidor, client?: PoolClient) {
    const query = 'INSERT into public.consumidores (id_usuario) VALUES($1);';
    if (client) {
      //Si hay client es que viene de la función register
      await client.query(query, [id_usuario]); //Por ahoro no hay campos adicionales en el consumidor al insertar.
    } else {
      //Transacción individual si no hay client especificado.
      await myPool.query(query, [id_usuario]); //Por ahoro no hay campos adicionales en el consumidor al insertar.
    }
  }

  /**
   * Activar rol Productor para un consumidor ya existente.
   * @param id_usuario
   * @param productor
   * @param client Se puede pasar un client si hay que ejecutarlo en la misma transacción. Caso register
   */
  async activarProductor(id_usuario: string, productor: AdicionalesProductor, client?: PoolClient) {
    const query = 'INSERT into public.productores (id_usuario,presentacion) VALUES($1,$2);';
    if (client) {
      //Si hay client es que viene de la función register
      client.query(query, [id_usuario, productor.presentacion]); //Por ahoro no hay campos adicionales en el consumidor al insertar.
    } else {
      //Transacción individual si no hay client especificado.
      myPool.query(query, [id_usuario]); //Por ahoro no hay campos adicionales en el consumidor al insertar.
    }
  }
}

export default new AuthRepositoryClass();
