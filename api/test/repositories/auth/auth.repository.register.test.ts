import { test } from 'node:test';
import * as assert from 'node:assert';
import authRepository from '@repositories/auth.repository.js';
import { myPool } from '@database/pool.js';
import { RegisterSchema } from '@schemas/auth.schema.js';
import { DeAcaInternal } from '@errors/response.errors.js';

test('AuthRepository - Suite de Pruebas', async (t) => {
  await t.test('register() - Caso: Consumidor', async (st) => {
    await st.test('Registro de consumidor', async () => {
      // Arrange
      const uniqueId = 'rcok' + Date.now();
      const datosConsumidor: RegisterSchema = {
        email: `c_${uniqueId}@test.com`,
        nombres: 'Juan',
        apellidos: 'Jorge',
        username: `c-${uniqueId}`,
        celular: `+1${Date.now()}`,
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['CONSUMIDOR'],
        consumidor: {},
      };

      // Act
      await authRepository.register(datosConsumidor);

      // Assert:
      //Query derecho de la bd
      const query = `
        SELECT 
          u.rol_actual, 
          to_jsonb(u.roles) as roles,
          dp.email,
          dp.username,
          EXISTS(SELECT 1 FROM credenciales WHERE id_usuario = u.id_usuario) as tiene_pass,
          EXISTS(SELECT 1 FROM consumidores WHERE id_usuario = u.id_usuario) as es_consumidor
        FROM public.usuarios u
        JOIN public.datos_personales dp ON u.id_usuario = dp.id_usuario
        WHERE dp.email = $1
      `;

      const { rows } = await myPool.query(query, [datosConsumidor.email]);
      const registro = rows[0];

      assert.ok(registro, 'El registro debería existir en la base de datos');
      assert.strictEqual(registro.email, datosConsumidor.email);
      assert.strictEqual(registro.username, datosConsumidor.username);
      assert.deepStrictEqual(registro.roles, ['CONSUMIDOR'], 'El array de roles en DB no coincide');
      assert.strictEqual(registro.tiene_pass, true, 'Debería haberse creado la credencial');
      assert.strictEqual(registro.es_consumidor, true, 'Debería existir en la tabla consumidores');
    });

    await st.test('Registro de productor', async () => {
      // Arrange
      const uniqueId = 'rpok' + Date.now();
      const datosConsumidor: RegisterSchema = {
        email: `${uniqueId}@test.com`,
        nombres: 'Juan',
        apellidos: 'Jorge',
        username: `p-${uniqueId}`,
        celular: `+2${Date.now()}`,
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['PRODUCTOR'],
        productor: {
          presentacion: 'La presentación del productor.',
        },
      };

      // Act
      await authRepository.register(datosConsumidor);

      // Assert:
      //Query derecho de la bd
      const query = `
        SELECT 
          u.rol_actual, 
          to_jsonb(u.roles) as roles,
          dp.email,
          dp.username,
          EXISTS(SELECT 1 FROM credenciales WHERE id_usuario = u.id_usuario) as tiene_pass,
          EXISTS(SELECT 1 FROM productores WHERE id_usuario = u.id_usuario) as es_productor
        FROM public.usuarios u
        JOIN public.datos_personales dp ON u.id_usuario = dp.id_usuario
        WHERE dp.email = $1
      `;

      const { rows } = await myPool.query(query, [datosConsumidor.email]);
      const registro = rows[0];

      assert.ok(registro, 'El registro debería existir en la base de datos');
      assert.strictEqual(registro.email, datosConsumidor.email);
      assert.strictEqual(registro.username, datosConsumidor.username);
      assert.deepStrictEqual(registro.roles, ['PRODUCTOR'], 'El array de roles en DB no coincide');
      assert.strictEqual(registro.tiene_pass, true, 'Debería haberse creado la credencial');
      assert.strictEqual(registro.es_productor, true, 'Debería existir en la tabla productors');
    });

    await st.test('Registro de consumidor y productor simultáneo', async () => {
      // Arrange
      const uniqueId = 'rcpok' + Date.now();
      const datosDuales: RegisterSchema = {
        email: `dual_${uniqueId}@test.com`,
        nombres: 'Multi',
        apellidos: 'Tarea',
        username: `d-${uniqueId}`,
        celular: `+3${Date.now()}`,
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['CONSUMIDOR', 'PRODUCTOR'],
        consumidor: {},
        productor: {
          presentacion: 'Soy productor y también compro.',
        },
      };

      // Act
      await authRepository.register(datosDuales);

      // Assert: Verificamos que existan registros en AMBAS tablas
      const query = `
        SELECT 
          u.roles,
          EXISTS(SELECT 1 FROM consumidores WHERE id_usuario = u.id_usuario) as es_consumidor,
          EXISTS(SELECT 1 FROM productores WHERE id_usuario = u.id_usuario) as es_productor
        FROM public.usuarios u
        JOIN public.datos_personales dp ON u.id_usuario = dp.id_usuario
        WHERE dp.email = $1
      `;

      const { rows } = await myPool.query(query, [datosDuales.email]);
      const registro = rows[0];

      assert.ok(registro, 'El usuario dual debería existir');
      // Verificamos que los roles estén ambos en el array
      const rolesEnDb = registro.roles as string[];
      assert.ok(rolesEnDb.includes('CONSUMIDOR'), 'Falta rol consumidor');
      assert.ok(rolesEnDb.includes('PRODUCTOR'), 'Falta rol productor');

      // Verificamos presencia en tablas específicas
      assert.strictEqual(registro.es_consumidor, true, 'No se creó el registro en consumidores');
      assert.strictEqual(registro.es_productor, true, 'No se creó el registro en productores');
    });

    await st.test('Registro de consumidor duplicado', async () => {
      // Arrange
      const uniqueId = 'rcd' + Date.now();
      const datosConsumidor: RegisterSchema = {
        email: `${uniqueId}@test.com`,
        nombres: 'Juan',
        apellidos: 'Jorge',
        username: `${uniqueId}`,
        celular: `+4${Date.now()}`,
        password: 'Contraseña.1',
        password2: 'Contraseña.1',
        roles: ['CONSUMIDOR'],
        consumidor: {},
      };

      // Act

      await authRepository.register(datosConsumidor); //Este anda.

      await assert.rejects(authRepository.register(datosConsumidor), (err: any) => {
        assert.ok(err instanceof DeAcaInternal);
        return true;
      });
    });
  });

  await t.test('activarConsumidor() y activarProductor() - Casos de error', async (st) => {
    // 1. Arrange: Creamos un usuario base usando register
    const uniqueId = 'act' + Date.now();
    const email = `${uniqueId}@test.com`;
    await authRepository.register({
      email,
      nombres: 'Test',
      apellidos: 'Activacion',
      username: `u-${uniqueId}`,
      celular: `+5${Date.now()}`,
      password: 'Contraseña.1',
      password2: 'Contraseña.1',
      roles: ['CONSUMIDOR', 'PRODUCTOR'], // Solo consumidor al empezar
      consumidor: {},
      productor: { presentacion: 'La presentacion.' },
    });

    // Obtenemos el id para las pruebas directas
    const { rows } = await myPool.query('SELECT id_usuario FROM datos_personales WHERE email = $1', [email]);
    const { id_usuario } = rows[0];

    await st.test('Debe fallar si se intenta activar un CONSUMIDOR que ya existe', async () => {
      // Act & Assert
      // Como ya se activó en el register, esto debe lanzar un error de Unique Constraint
      await assert.rejects(authRepository.activarConsumidor(id_usuario, {}), (err: any) => {
        // Si tu repo no tiene un try/catch específico en activarConsumidor,
        // tirará el error de pg directo.
        return err.code === '23505' || err.message.includes('duplicate key');
      });
    });

    await st.test('Debe fallar si se intenta activar un PRODUCTOR que ya existe', async () => {
      // Primero lo activamos una vez exitosamente

      // Act & Assert: Intentamos de nuevo
      await assert.rejects(
        authRepository.activarProductor(id_usuario, { presentacion: 'Segunda vez' }),
        (err: any) => {
          return err.code === '23505' || err.message.includes('duplicate key');
        },
      );
    });
  });
});
