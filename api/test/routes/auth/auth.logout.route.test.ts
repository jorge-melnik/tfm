import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app
import authRepository from '@repositories/auth.repository.js';

test('/auth/logout', async (t) => {
  const app = await build(t);

  // Arrange: Usuario para las pruebas
  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `logout-${uniqueId}@test.com`;
  const username = `logout-${uniqueId}`;

  // Usamos el repo para registrar al usuario que vamos a intentar loguear
  await authRepository.register({
    email,
    nombres: 'Ruta',
    apellidos: 'Test',
    username,
    celular: `+2${uniqueId}`,
    password,
    password2: password,
    roles: ['CONSUMIDOR'],
    consumidor: {},
  });

  await t.test('/auth/logout - Escenarios', async (st) => {
    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password },
    });
    const { token } = JSON.parse(loginRes.payload);

    await st.test('Debe hacer logout exitosamente', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/logout',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      assert.equal(res.statusCode, 204);

      const rtCookie = res.cookies.find((c) => c.name === 'refreshToken');

      if (!rtCookie) {
        assert.fail('La respuesta debería incluir el set-cookie para limpiar el refresh token');
      }

      const expiry = rtCookie.expires;

      if (expiry instanceof Date) {
        assert.ok(expiry.getTime() <= Date.now(), 'La cookie de refresh debe estar expirada');
      } else {
        const maxAge = rtCookie.maxAge;
        assert.ok(maxAge !== undefined && maxAge <= 0, 'La cookie debería tener un Max-Age de 0 o menor');
      }
    });

    await st.test('Debe fallar (401) si se intenta logout sin token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/logout',
      });

      assert.equal(res.statusCode, 401);
    });
  });
});
