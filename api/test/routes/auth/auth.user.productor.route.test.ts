import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js'; // Tu helper que levanta la app
import authRepository from '@repositories/auth.repository.js';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { Consumidor } from '@schemas/consumidores.schema.js';

await test('/auth/user/productor', async (t) => {
  const app = await build(t);
  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `productor-${uniqueId}@tet.com`;
  const username = `pro-${uniqueId}`;

  await authRepository.register({
    email,
    nombres: 'Solo',
    apellidos: 'Consumidor',
    username,
    celular: `+6${uniqueId}`,
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

  const consumidorCreado: Consumidor = await consumidorRepository.getOneBy({ email });

  await t.test('Debe activar el perfil de productor exitosamente', async () => {
    const payloadProductor = {
      id_productor: consumidorCreado.id_consumidor,
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

  await t.test('Debe fallar (400) si el body es inválido', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/user/productor',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        // Enviamos algo que no cumple con AdicionalesProductor
        id_productor: consumidorCreado.id_consumidor,
        bio: 'esto no es lo que el esquema espera',
      },
    });

    assert.equal(res.statusCode, 400, 'Debe fallar por validación de TypeBox');
  });

  await t.test('Debe fallar (401) si no hay token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/user/productor',
      payload: {
        id_productor: consumidorCreado.id_consumidor,
        presentacion: '...',
      },
    });

    assert.equal(res.statusCode, 401);
  });

  await t.test('Activar productor que ya es profuctor.', async () => {
    const payloadProductor = {
      id_productor: consumidorCreado.id_consumidor,
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
