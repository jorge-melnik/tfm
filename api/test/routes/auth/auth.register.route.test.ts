import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app

test('/auth/register', async (t) => {
  const app = await build(t);

  await t.test('Registrar consumidor', async () => {
    const uniqueId = Date.now();
    const nuevoUsuario = {
      email: `register-${uniqueId}@test.com`,
      nombres: 'Test',
      apellidos: 'Registro',
      username: `reg-${uniqueId}`,
      celular: `+4${uniqueId}`,
      password: 'Contraseña.1',
      password2: 'Contraseña.1',
      roles: ['CONSUMIDOR'],
      consumidor: {},
    };

    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: nuevoUsuario,
    });

    const body = JSON.parse(res.payload);

    // Assert: Status OK y entrega de Token
    assert.equal(res.statusCode, 200);
    assert.ok(body.token, 'Debe devolver un access token tras el registro');

    // Assert: Cookie de sesión
    const rtCookie = res.cookies.find((c) => c.name === 'refreshToken');
    assert.ok(rtCookie, 'Debe setear la cookie refreshToken automáticamente');
    assert.strictEqual(rtCookie.httpOnly, true);
  });

  await t.test('Debe fallar (400) si las contraseñas no coinciden', async () => {
    // Asumiendo que tu RegisterSchema o el repo validan que password === password2
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'error-pass@test.com',
        nombres: 'Error',
        apellidos: 'Pass',
        username: 'errorpass',
        celular: '+123456',
        password: 'Password.123',
        password2: 'Password.DISTINTA',
        roles: ['CONSUMIDOR'],
        consumidor: {},
      },
    });

    // Si tenés validación en el esquema, esto devuelve 400.
    // Si la lógica está en el repo y tira error, podría ser 400 o 500 según tu manejo.
    assert.equal(res.statusCode, 400);
  });
});
