import { myPool } from '@database/pool.js';
import type { QueryResult } from 'pg';
import { InternalError, NotFoundError, UnAuthenticatedError } from '@errors/response.errors.js';
import { Profile, RegisterSchema, Rol, TokenPayload, User } from '@schemas/auth.schema.js';
import { productorRepository } from './productor.repository.js';
import { consumidorRepository } from './consumidor.repository.js';
import { datosPersonalesRepository } from './datos-personales.respository.js';
import { DatosPersonales } from '@schemas/usuarios.schema.js';

class AuthRepositoryClass {
  /**
   * Devuelve el usuario que tenga el email y password especificado o tira 401
   */
  async emailLogin(email: string, password: string): Promise<TokenPayload> {
    const query = `
      SELECT U.id_usuario,DP.username, to_jsonb(roles) as roles 
      FROM public.usuarios U
      JOIN public.credenciales C ON C.id_usuario = U.id_usuario
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE email = $1 AND password_hash = crypt($2, C.password_hash)
    `;

    const { rows }: QueryResult<TokenPayload> = await myPool.query(query, [email, password]);

    if (rows.length !== 1) {
      throw new UnAuthenticatedError();
    }
    return rows[0];
  }

  /**
   * Devuelve el usuario que tenga el usarname y password especificado o tira 401
   */
  async usernameLogin(username: string, password: string): Promise<TokenPayload> {
    const query = `
      SELECT U.id_usuario, DP.username, to_jsonb(roles) as roles 
      FROM public.usuarios U
      JOIN public.credenciales C ON C.id_usuario = U.id_usuario
      JOIN public.datos_personales DP ON DP.id_usuario = U.id_usuario
      WHERE username = $1 AND password_hash = crypt($2, C.password_hash)
    `;

    const { rows }: QueryResult<TokenPayload> = await myPool.query(query, [username, password]);

    if (rows.length !== 1) {
      throw new UnAuthenticatedError();
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
      throw new NotFoundError('Usuario con id_usuario ' + id_usuario);
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

    if (rows.length === 0) {
      //Si no existe refresh token, hay que borrar todas las sesiones por seguridad
      const borrarQuery = 'DELETE FROM public.refresh_tokens WHERE id_usuario=$1';
      await myPool.query(borrarQuery, [decoded.id_usuario]);
      throw new UnAuthenticatedError('RT no valido.');
    }
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
    const client = await myPool.connect(); //Obtenemos un cliente para poder hacer una transacción
    const dpRepoWT = datosPersonalesRepository.withTransaction(client);
    const productorRepoWT = productorRepository.withTransaction(client);
    const consumidorRepoWT = consumidorRepository.withTransaction(client);

    try {
      await client.query('BEGIN;');
      //Primero crear el usuario
      const queryUsuario = 'INSERT INTO usuarios (rol_actual, roles) VALUES ($1, $2) RETURNING *';
      const { rows }: QueryResult<{ id_usuario: string }> = await client.query(queryUsuario, [
        dp.roles[0],
        dp.roles,
      ]);
      const { id_usuario } = rows[0]; //Tengo el id_usuario creado
      const datosPersonales: DatosPersonales = {
        id_usuario,
        nombres: dp.nombres,
        apellidos: dp.apellidos,
        email: dp.email,
        username: dp.username,
        celular: dp.celular,
      };
      //Segundo guardar datos personales.
      await dpRepoWT.add(datosPersonales);
      //Tercero, activar consumidor y/o productor según corresponda.
      if (dp.consumidor) await productorRepoWT.activarConsumidor(id_usuario, dp.consumidor);
      if (dp.productor) await consumidorRepoWT.activarProductor(id_usuario, dp.productor);

      //Último: insertar credenciales
      const credencialesQuery = `
        INSERT INTO credenciales (id_usuario, password_hash) 
        VALUES ($1, crypt($2, gen_salt('bf', 10)))
        ;
      `;
      await client.query(credencialesQuery, [id_usuario, dp.password]);
      await client.query('COMMIT;'); //Confirmar transacción
    } catch (error: any) {
      await client.query('ROLLBACK;');
      throw new InternalError(error.message);
    } finally {
      client.release();
    }
  }

  async setRolActual(id_usuario: string, rol_actual: Rol) {
    const query = `
      UPDATE public.usuarios SET rol_actual=$2
      WHERE id_usuario=$1
    `;
    await myPool.query(query, [id_usuario, rol_actual]);
  }

  async borrarCuenta(id_usuario: string) {
    //Desactivar Usuario, Consumidor, y Productor.
    //Borrar datos personales.
    //Borrar en  credenciales, cuenta_externa y refresh_tokens.
    //NO se borran rol_actual ni roles de la tabla usuarios.
    const consulta = `
      WITH DP AS (
        DELETE FROM public.datos_personales WHERE id_usuario=$1 
      ),
      U AS (
        DELETE FROM public.usuarios WHERE id_usuario=$1
      ),
      CON AS (
        DELETE FROM public.consumidores WHERE id_consumidor=$1
      ),
      PROD AS (
        DELETE FROM public.productores WHERE id_productor=$1
      ),
      CRED AS (
        DELETE FROM public.credenciales WHERE id_usuario=$1
      ),
      CE AS (
        DELETE FROM public.cuentas_externas WHERE id_usuario=$1
      ),
      RT AS (
        DELETE FROM public.refresh_tokens WHERE id_usuario=$1
      )
      SELECT 1;
    `;
    await myPool.query(consulta, [id_usuario]);
  }
}

export default new AuthRepositoryClass();
