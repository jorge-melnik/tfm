import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app
import authRepository from '@repositories/auth.repository.js';

test('Auth Routes - Login', async (t) => {
  const app = await build(t);

  // Arrange: Usuario para las pruebas
  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `email-${uniqueId}@test.com`;
  const username = `user-${uniqueId}`;

  // Usamos el repo para registrar al usuario que vamos a intentar loguear
  await authRepository.register({
    email,
    nombres: 'Ruta',
    apellidos: 'Test',
    username,
    celular: `+${uniqueId}`,
    password,
    password2: password,
    roles: ['CONSUMIDOR'],
    consumidor: {},
  });

  await t.test('POST /login/email - Éxito', async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password },
    });

    const body = JSON.parse(res.payload);

    // Assert Body
    assert.equal(res.statusCode, 200);
    assert.ok(body.token, 'Debe devolver un access token');

    // Assert Cookie (Refresh Token)
    const cookies = res.cookies;
    const rtCookie = cookies.find((c) => c.name === 'refreshToken');

    assert.ok(rtCookie, 'Debe setear la cookie refreshToken');
    assert.ok(rtCookie.httpOnly, 'La cookie debe ser httpOnly');
    assert.strictEqual(rtCookie.path, '/api/auth/refresh', 'Path de cookie incorrecto');
  });

  await t.test('POST /login/email - Credenciales inválidas', async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password: 'PassIncorrecta' },
    });

    const body = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 401);
    assert.equal(body.code, 'DEACA_UNAUTHENTICATED');
  });

  await t.test('POST /login/email - Body inválido (TypeBox)', async () => {
    // Act: Enviamos email sin formato de email
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email: 'esto-no-es-un-email', password: '123' },
    });

    // Assert
    assert.equal(res.statusCode, 400, 'Debe fallar por validación de esquema');
  });

  await t.test('POST /login/username - Éxito', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/username',
      payload: { username, password },
    });

    const body = JSON.parse(res.payload);
    console.log({ body });
    // Assert Body
    assert.equal(res.statusCode, 200);
    assert.ok(body.token, 'Debe devolver un access token');

    // Assert Cookie (Refresh Token)
    const cookies = res.cookies;
    const rtCookie = cookies.find((c) => c.name === 'refreshToken');

    assert.ok(rtCookie, 'Debe setear la cookie refreshToken');
    assert.ok(rtCookie.httpOnly, 'La cookie debe ser httpOnly');
    assert.strictEqual(rtCookie.path, '/api/auth/refresh', 'Path de cookie incorrecto');
  });

  await t.test('POST /login/username - Username inexistente', async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/username',
      payload: { username: 'no-existe-este-pibe', password: 'Password.123' },
    });

    // Assert
    assert.equal(res.statusCode, 401);
  });

  await t.test('GET /profile - Escenarios', async (st) => {
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
        url: '/auth/profile',
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
        url: '/auth/profile',
        // Sin headers
      });

      assert.equal(res.statusCode, 401);
    });

    await st.test('Debe fallar (401) si el token es inválido', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/auth/profile',
        headers: {
          authorization: `Bearer un-token-cualquiera-mal-formateado`,
        },
      });

      assert.equal(res.statusCode, 401);
    });
  });
});
