import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';

test('/categorias', async (t) => {
  const app = await build(t);

  await t.test('GET /categorias', async () => {
    //ARRANGE
    const nombre = 'Nombre GET ' + Date.now();
    await categoriasRepository.add({
      nombre,
      descripcion: 'Test de listado',
      categoria: '',
    });

    //ACT
    const res = await app.inject({
      method: 'GET',
      url: '/categorias',
    });

    const categorias: Categoria[] = JSON.parse(res.payload);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(categorias), 'El resultado debe ser un array');
    assert.ok(categorias.length > 0, 'El array debería tener al menos un elemento');
  });
});
