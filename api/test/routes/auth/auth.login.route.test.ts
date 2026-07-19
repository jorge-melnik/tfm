import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app
import authRepository from '@repositories/auth.repository.js';

test('/auth/login', async (t) => {
  const app = await build(t);

  // Arrange: Usuario para las pruebas
  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `login-${uniqueId}@test.com`;
  const username = `login-${uniqueId}`;

  // Usamos el repo para registrar al usuario que vamos a intentar loguear
  await authRepository.register({
    email,
    nombres: 'Ruta',
    apellidos: 'Test',
    username,
    celular: `+1${uniqueId}`,
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
});
