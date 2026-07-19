import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js';
import authRepository from '@repositories/auth.repository.js';
import { Productor } from '@schemas/productores.schema.js';
import { productorRepository } from '@repositories/productor.repository.js';

test('/auth/user/consumidor', async (t) => {
  const app = await build(t);

  const uniqueId = Date.now();
  const password = 'Contraseña.1';
  const email = `consumidor-${uniqueId}@tet.com`;
  const username = `con-${uniqueId}`;

  await authRepository.register({
    email,
    nombres: 'Solo',
    apellidos: 'Productor',
    username,
    celular: `+5${uniqueId}`,
    password,
    password2: password,
    roles: ['PRODUCTOR'],
    productor: { presentacion: 'la presentacion.' },
  });

  const productorCreado: Productor = await productorRepository.getOneBy({ email });

  // Login para obtener el token
  const loginRes = await app.inject({
    method: 'POST',
    url: '/auth/login/email',
    payload: { email, password },
  });
  const { token } = JSON.parse(loginRes.payload);

  await t.test('Debe activar el perfil de consumidor exitosamente', async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/user/consumidor',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: { id_consumidor: productorCreado.id_productor },
    });

    const body = JSON.parse(res.payload);
    // Assert
    assert.equal(res.statusCode, 200);
    assert.equal(body.username, username);

    assert.ok(body.roles.includes('CONSUMIDOR'), 'El usuario debería tener el rol CONSUMIDOR ahora');
    assert.ok(body.roles.includes('PRODUCTOR'), 'El usuario aún debería tener el rol PRODUCTOR');
  });

  await t.test('Debe fallar (401) si no hay token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/user/consumidor',
      payload: { presentacion: '...' },
    });

    assert.equal(res.statusCode, 401);
  });

  await t.test('Activar consumidor que ya es consumidor.', async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/auth/user/consumidor',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: { id_consumidor: productorCreado.id_productor },
    });

    // Assert
    assert.equal(res.statusCode, 500);
  });
});
