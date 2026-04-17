import { test } from 'node:test';
import * as assert from 'node:assert';
import { Token } from '@schemas/auth.schema.js';
import { build } from '../helper.js';

test('API Auth - Login', async (t) => {
  const app = await build(t);

  await t.test('POST /auth/login/email - debería loguearse con email correctamente', async () => {
    // Arrange
    const payload = {
      email: 'admin@deaca.com',
      password: 'Contraseña',
    };

    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload,
    });

    const body: Token = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.ok(body.token, 'Debería devolver un token de acceso');
  });

  await t.test('POST /auth/login/username - debería loguearse con username correctamente', async () => {
    // Arrange
    const payload = {
      username: 'productor',
      password: 'Contraseña',
    };

    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/username',
      payload,
    });

    const body: Token = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.ok(body.token, 'Debería devolver un token de acceso');
  });

  await t.test('POST /auth/login/username - debería fallar con contraseña incorrecta', async () => {
    // Arrange
    const payload = {
      username: 'consumidor',
      password: 'PasswordEquivocada',
    };

    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login/username',
      payload,
    });

    // Assert
    assert.equal(res.statusCode, 401, 'Debería devolver 401 Unauthorized');
  });
});
