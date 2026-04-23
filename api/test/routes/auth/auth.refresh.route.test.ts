import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app
import authRepository from '@repositories/auth.repository.js';

test('/auth/refresh', async (t) => {
  const app = await build(t);

  // Arrange: Usuario para las pruebas
  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `refresh-${uniqueId}@test.com`;
  const username = `ref-${uniqueId}`;

  // Usamos el repo para registrar al usuario que vamos a intentar loguear
  await authRepository.register({
    email,
    nombres: 'Ruta',
    apellidos: 'Test',
    username,
    celular: `+3${uniqueId}`,
    password,
    password2: password,
    roles: ['CONSUMIDOR'],
    consumidor: {},
  });

  await t.test('/auth/refresh', async (st) => {
    // 1. Obtenemos un Refresh Token válido vía Login
    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password },
    });

    const rtCookie = loginRes.cookies.find((c) => c.name === 'refreshToken');
    assert.ok(rtCookie, 'Debe existir la cookie de refresh tras login');

    await st.test('Debe refrescar exitosamente y rotar el token', async () => {
      // Act: Enviamos la cookie al endpoint de refresh
      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        cookies: {
          refreshToken: rtCookie.value,
        },
      });

      const body = JSON.parse(res.payload);

      // Assert
      assert.equal(res.statusCode, 200);
      assert.ok(body.token, 'Debe devolver un nuevo access token');

      // Verificar que se envió una NUEVA cookie (rotación)
      const newRtCookie = res.cookies.find((c) => c.name === 'refreshToken');
      assert.ok(newRtCookie, 'Debe devolver una nueva cookie de refresh');
      assert.notStrictEqual(
        newRtCookie.value,
        rtCookie.value,
        'El refresh token debe haber cambiado (rotación)',
      );
    });

    await st.test(
      'Debe fallar (401) si se intenta usar el token viejo otra vez (Reuse Detection)',
      async () => {
        // Como tu código hace removeRefreshToken en el onRequest, el rtCookie original ya no es válido
        const res = await app.inject({
          method: 'POST',
          url: '/auth/refresh',
          cookies: {
            refreshToken: rtCookie.value, // Token ya usado en el test anterior
          },
        });

        assert.equal(res.statusCode, 401, 'Debe fallar porque el token ya fue removido de la DB');
      },
    );

    await st.test('Debe fallar (401) si no hay cookie', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        // Sin cookies
      });

      assert.equal(res.statusCode, 401);
    });

    await st.test('Debe fallar (401) cuando la cookie existe pero está vacía', async () => {
      // Act: Enviamos la cookie con un string vacío
      // Esto simula que la cabecera Cookie existe pero no tiene el valor esperado
      const res = await app.inject({
        method: 'POST',
        url: '/auth/refresh',
        cookies: {
          refreshToken: '',
        },
      });

      // Assert
      assert.equal(res.statusCode, 401);
    });
  });
});
