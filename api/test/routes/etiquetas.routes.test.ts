import { test } from 'node:test';
import * as assert from 'node:assert';
import { Etiqueta } from '@schemas/categoria.schema.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { build } from '../helper.js';

test('API /etiquetas', async (t) => {
  const app = await build(t);

  await t.test('GET / - debería listar todas las etiquetas', async () => {
    // Arrange
    await etiquetasRepository.add({
      nombre: 'Etiqueta List Test ' + Date.now(),
      slug_etiqueta: 'list-test-' + Date.now(),
    });

    // Act
    const res = await app.inject({
      method: 'GET',
      url: '/etiquetas',
    });

    const etiquetas: Etiqueta[] = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.ok(Array.isArray(etiquetas), 'Debería devolver un array');
    assert.ok(etiquetas.length > 0, 'El array no debería estar vacío');
  });

  await t.test('POST / - debería crear una etiqueta exitosamente', async () => {
    // Arrange
    const nombre = 'Nueva Etiqueta ' + Date.now();
    const slug_etiqueta = etiquetasRepository.createSlug(nombre);

    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/etiquetas',
      payload: {
        nombre,
        slug_etiqueta,
      },
    });

    const etiquetaCreada: Etiqueta = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 201, 'No coincide statusCode');
    assert.ok(etiquetaCreada.id_etiqueta, 'Debería tener id_etiqueta');
    assert.equal(etiquetaCreada.nombre, nombre, 'No coincide el nombre enviado');
    assert.equal(etiquetaCreada.slug_etiqueta, slug_etiqueta, 'No coincide el slug');
  });

  await t.test('GET /:slug_etiqueta - debería obtener una etiqueta por su slug', async () => {
    // Arrange
    const nombre = 'Etiqueta Slug Test ' + Date.now();
    const slug_etiqueta = etiquetasRepository.createSlug(nombre);

    await etiquetasRepository.add({
      nombre,
      slug_etiqueta,
    });

    // Act
    const res = await app.inject({
      method: 'GET',
      url: `/etiquetas/${slug_etiqueta}`,
    });

    const etiqueta: Etiqueta = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.equal(etiqueta.slug_etiqueta, slug_etiqueta, 'No coincide el slug');
    assert.equal(etiqueta.nombre, nombre, 'No coincide el nombre');
  });

  await t.test('PUT /:id_etiqueta - debería actualizar el nombre', async () => {
    // Arrange
    const nombreOriginal = 'Original ' + Date.now();
    const slugOriginal = etiquetasRepository.createSlug(nombreOriginal);
    const creada = await etiquetasRepository.add({
      nombre: nombreOriginal,
      slug_etiqueta: slugOriginal,
    });

    const nuevoNombre = 'Actualizada ' + Date.now();

    // Act
    const res = await app.inject({
      method: 'PUT',
      url: `/etiquetas/${creada.id_etiqueta}`,
      payload: {
        ...creada,
        nombre: nuevoNombre,
      },
    });

    const editada: Etiqueta = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.equal(editada.id_etiqueta, creada.id_etiqueta, 'No coincide el ID');
    assert.equal(editada.nombre, nuevoNombre, 'El nombre no se actualizó');
    assert.equal(editada.slug_etiqueta, slugOriginal, 'El slug no debería haber cambiado');
  });

  await t.test('DELETE /:id_etiqueta - debería borrar la etiqueta por ID (204)', async () => {
    // Arrange
    const creada = await etiquetasRepository.add({
      nombre: 'Para Borrar ' + Date.now(),
      slug_etiqueta: 'borrar-' + Date.now(),
    });

    // Act
    const res = await app.inject({
      method: 'DELETE',
      url: `/etiquetas/${creada.id_etiqueta}`,
    });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    assert.equal(res.payload, '', 'El payload debería estar vacío');
  });
});
