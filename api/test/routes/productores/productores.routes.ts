import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js';
import authRepository from '@repositories/auth.repository.js';
import { productorRepository } from '@repositories/productor.repository.js';
import { Productor } from '@schemas/productores.schema.js';

test('/productores', async (t) => {
  const app = await build(t);
  const username = 'act' + Date.now();
  const email = `${username}@test.com`;
  await authRepository.register({
    email,
    nombres: 'Test',
    apellidos: 'Productores',
    username,
    celular: `+4${Date.now()}`,
    password: 'Contraseña.1',
    password2: 'Contraseña.1',
    roles: ['PRODUCTOR'],
    productor: { presentacion: 'La presentacion.' },
  });
  const productorCreado: Productor = await productorRepository.getOneBy({ email });

  await t.test('GET /productores', async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: '/productores',
    });

    const productores: Productor[] = JSON.parse(res.payload);
    const productorBuscado = productores.find((p) => p.id_usuario === productorCreado.id_usuario);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(productores), 'El resultado debe ser un array');
    assert.ok(productores.length > 0, 'El array debería tener al menos un elemento');
    assert.ok(productorBuscado, 'Debería existir el productor');
  });

  await t.test('GET /productores/:username', async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: '/productores/' + username,
    });

    const productor: Productor = JSON.parse(res.payload);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.equal(productor.id_usuario, productorCreado.id_usuario);
    assert.equal(productor.email, productorCreado.email);
    assert.equal(productor.username, productorCreado.username);
  });
});
