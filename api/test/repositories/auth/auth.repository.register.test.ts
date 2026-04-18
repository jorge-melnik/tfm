import { test } from 'node:test';
import * as assert from 'node:assert';
import authRepository from '@repositories/auth.repository.js';
import { myPool } from '@database/pool.js';
import { RegisterSchema } from '@schemas/auth.schema.js';

test('AuthRepository - Suite de Pruebas', async (t) => {
  await t.test('register() - Caso: Consumidor', async (st) => {
    await st.test('Registro de consumidor', async () => {
      // Arrange
      const uniqueId = Date.now();
      const datosConsumidor: RegisterSchema = {
        email: `c_${uniqueId}@test.com`,
        nombres: 'Juan',
        apellidos: 'Jorge',
        username: `c-${uniqueId}`,
        celular: `+${uniqueId}`,
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
      const uniqueId = Date.now();
      const datosConsumidor: RegisterSchema = {
        email: `p_${uniqueId}@test.com`,
        nombres: 'Juan',
        apellidos: 'Jorge',
        username: `p-${uniqueId}`,
        celular: `+${uniqueId}`,
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
      const uniqueId = Date.now();
      const datosDuales: RegisterSchema = {
        email: `dual_${uniqueId}@test.com`,
        nombres: 'Multi',
        apellidos: 'Tarea',
        username: `d-${uniqueId}`,
        celular: `+${uniqueId}`,
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
  });
});
