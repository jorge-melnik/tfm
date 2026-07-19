import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app
import authRepository from '@repositories/auth.repository.js';
test('/auth/login', async (t) => {
  const app = await build(t);

  // Arrange: Usuario para las pruebas
  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `user-${uniqueId}@test.com`;
  const username = `user-${uniqueId}`;

  // Usamos el repo para registrar al usuario que vamos a intentar loguear
  await authRepository.register({
    email,
    nombres: 'Ruta',
    apellidos: 'Test',
    username,
    celular: `+7${uniqueId}`,
    password,
    password2: password,
    roles: ['CONSUMIDOR'],
    consumidor: {},
  });

  await t.test('/auth/user', async (st) => {
    // Obtenemos un token válido primero
    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password },
    });
    const { token } = JSON.parse(loginRes.payload);

    await st.test('Debe retornar el perfil si el token es válido', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/auth/user',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const body = JSON.parse(res.payload);

      assert.equal(res.statusCode, 200);
      assert.equal(body.username, username);
      assert.ok(Array.isArray(body.roles), 'Roles debe ser un array');
    });

    await st.test('Debe fallar (401) si no se envía token', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/auth/user',
        // Sin headers
      });

      assert.equal(res.statusCode, 401);
    });

    await st.test('Debe fallar (401) si el token es inválido', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/auth/user',
        headers: {
          authorization: `Bearer un-token-cualquiera-mal-formateado`,
        },
      });

      assert.equal(res.statusCode, 401);
    });
  });
});
