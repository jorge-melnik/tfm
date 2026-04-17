import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';

test('API Categorías - /categorias', async (t) => {
  const app = await build(t);

  await t.test('POST / - debería crear una categoría con éxito', async () => {
    const nombre = 'NombrePOST ' + Date.now();
    const payload = {
      nombre,
      descripcion: 'Descripcion ' + Date.now(),
      slug_categoria: '',
    };

    const res = await app.inject({
      method: 'POST',
      url: '/categorias',
      payload,
    });

    const categoriaCreada: Categoria = JSON.parse(res.payload);
    assert.equal(res.statusCode, 201);
    assert.ok(categoriaCreada.id_categoria, 'Debería devolver un ID generado');
    assert.equal(categoriaCreada.nombre, nombre);
    assert.ok(categoriaCreada.slug_categoria, 'El slug debería haberse generado automáticamente');
  });

  await t.test('GET / - debería listar las categorías existentes', async () => {
    const nombre = 'Nombre GET ' + Date.now();
    const payload = {
      nombre,
      descripcion: 'Test de listado',
      slug_categoria: '',
    };
    const resPOST = await app.inject({
      method: 'POST',
      url: '/categorias',
      payload,
    });

    const res = await app.inject({
      method: 'GET',
      url: '/categorias',
    });

    const categorias: Categoria[] = JSON.parse(res.payload);

    assert.equal(resPOST.statusCode, 201, 'No se creó la categoria antes de pedir el listado.');
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(categorias), 'El resultado debe ser un array');
    assert.ok(categorias.length > 0, 'El array debería tener al menos un elemento');
  });
});
