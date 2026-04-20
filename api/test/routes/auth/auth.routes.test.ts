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

  await t.test('GET /user - Escenarios', async (st) => {
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

  await t.test('POST /refresh - Escenarios', async (st) => {
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

  await t.test('POST /logout - Escenarios', async (st) => {
    // Obtenemos un token válido para poder entrar a la ruta (está protegida)
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

      // 1. Verificamos que la cookie exista en el header Set-Cookie
      if (!rtCookie) {
        assert.fail('La respuesta debería incluir el set-cookie para limpiar el refresh token');
      }

      // 2. Verificamos la expiración de forma segura para TS
      const expiry = rtCookie.expires;

      // Si existe expiry, chequeamos que sea pasado.
      // Si no existe, chequeamos que maxAge sea 0 o -1 (otra forma de limpiar)
      if (expiry instanceof Date) {
        assert.ok(expiry.getTime() <= Date.now(), 'La cookie de refresh debe estar expirada');
      } else {
        // Algunas implementaciones de inject mapean el Max-Age de la cookie
        // @ts-ignore - Dependiendo de la versión de light-my-request
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

  await t.test('POST /register - Escenarios', async (st) => {
    await st.test('Registrar consumidor', async () => {
      const uniqueId = Date.now(); // Offset para evitar colisiones
      const nuevoUsuario = {
        email: `r-${uniqueId}@test.com`,
        nombres: 'Test',
        apellidos: 'Registro',
        username: `r-${uniqueId}`,
        celular: `+54${uniqueId}`,
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

    await st.test('Debe fallar (400) si las contraseñas no coinciden', async () => {
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

  await t.test('POST /user/productor - Escenarios', async (st) => {
    // 1. Arrange: Creamos un usuario que inicialmente es SOLO consumidor
    const uniqueId = Date.now();
    const password = 'Contraseña.1';
    const email = `cons-${uniqueId}@test.com`;
    const username = `c-${uniqueId}`;

    await authRepository.register({
      email,
      nombres: 'Solo',
      apellidos: 'Consumidor',
      username,
      celular: `+${uniqueId}`,
      password,
      password2: password,
      roles: ['CONSUMIDOR'],
      consumidor: {},
    });

    // Login para obtener el token
    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password },
    });
    const { token } = JSON.parse(loginRes.payload);

    await st.test('Debe activar el perfil de productor exitosamente', async () => {
      const payloadProductor = {
        presentacion: 'Hola, ahora soy productor de hortalizas.',
      };

      // Act
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/productor',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: payloadProductor,
      });

      const body = JSON.parse(res.payload);

      // Assert
      assert.equal(res.statusCode, 200);
      assert.equal(body.username, username);

      // Verificamos que ahora tenga ambos roles o al menos el de PRODUCTOR
      assert.ok(body.roles.includes('PRODUCTOR'), 'El usuario debería tener el rol PRODUCTOR ahora');

      // Opcional: Si tu ProfileSchema devuelve la presentación, la chequeamos
      if (body.productor) {
        assert.equal(body.productor.presentacion, payloadProductor.presentacion);
      }
    });

    await st.test('Debe fallar (400) si el body es inválido', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/productor',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          // Enviamos algo que no cumple con AdicionalesProductor
          bio: 'esto no es lo que el esquema espera',
        },
      });

      assert.equal(res.statusCode, 400, 'Debe fallar por validación de TypeBox');
    });

    await st.test('Debe fallar (401) si no hay token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/productor',
        payload: { presentacion: '...' },
      });

      assert.equal(res.statusCode, 401);
    });

    await st.test('Activar productor que ya es profuctor.', async () => {
      const payloadProductor = {
        presentacion: 'Hola, YA soy productor de hortalizas.',
      };

      // Act
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/productor',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: payloadProductor,
      });

      // Assert
      assert.equal(res.statusCode, 500);
    });
  });

  await t.test('POST /user/consumidor - Escenarios', async (st) => {
    // 1. Arrange: Creamos un usuario que inicialmente es SOLO productor
    const uniqueId = Date.now();
    const password = 'Contraseña.1';
    const email = `prod-${uniqueId}@test.com`;
    const username = `p-${uniqueId}`;

    await authRepository.register({
      email,
      nombres: 'Solo',
      apellidos: 'Productor',
      username,
      celular: `+${uniqueId}`,
      password,
      password2: password,
      roles: ['PRODUCTOR'],
      productor: { presentacion: 'la presentacion.' },
    });

    // Login para obtener el token
    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login/email',
      payload: { email, password },
    });
    const { token } = JSON.parse(loginRes.payload);

    await st.test('Debe activar el perfil de consumidor exitosamente', async () => {
      // Act
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/consumidor',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: { consumidor: {} },
      });

      const body = JSON.parse(res.payload);
      // Assert
      assert.equal(res.statusCode, 200);
      assert.equal(body.username, username);

      assert.ok(body.roles.includes('CONSUMIDOR'), 'El usuario debería tener el rol CONSUMIDOR ahora');
      assert.ok(body.roles.includes('PRODUCTOR'), 'El usuario aún debería tener el rol PRODUCTOR');
    });

    // await st.test('Debe fallar (400) si el body es inválido', async () => {
    //   const res = await app.inject({
    //     method: 'POST',
    //     url: '/auth/user/consumidor',
    //     headers: {
    //       authorization: `Bearer ${token}`,
    //     },
    //     payload: { algo: 'esto no es lo que el esquema espera' },
    //   });
    //   console.log(res.payload);
    //   assert.equal(res.statusCode, 400, 'Debe fallar por validación de TypeBox');
    // });

    await st.test('Debe fallar (401) si no hay token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/consumidor',
        payload: { presentacion: '...' },
      });

      assert.equal(res.statusCode, 401);
    });

    await st.test('Activar consumidor que ya es consumidor.', async () => {
      // Act
      const res = await app.inject({
        method: 'POST',
        url: '/auth/user/consumidor',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: { consumidor: {} },
      });

      // Assert
      assert.equal(res.statusCode, 500);
    });
  });
});
