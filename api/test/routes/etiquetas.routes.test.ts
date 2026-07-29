import { test } from 'node:test';
import * as assert from 'node:assert';
import { Etiqueta } from '@schemas/categoria.schema.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { build } from '../helper.js';

test('API /etiquetas', async (t) => {
  const app = await build(t);
  const nombre = 'etiqueta ' + Date.now();

  //CREATE
  await t.test('POST /admin/etiquetas', async () => {
    // Arrange
    const etiqueta = etiquetasRepository.createSlug(nombre); //Necesario para chequearlo

    // Act
    const res = await app.inject({
      method: 'POST',
      url: '/admin/etiquetas',
      payload: {
        nombre,
        etiqueta: '',
      },
    });

    const etiquetaCreada: Etiqueta = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 201, 'No coincide statusCode');
    assert.ok(etiquetaCreada.id_etiqueta, 'Debería tener id_etiqueta');
    assert.equal(etiquetaCreada.nombre, nombre, 'No coincide el nombre enviado');
    assert.equal(etiquetaCreada.etiqueta, etiqueta, 'No coincide el slug');
  });

  //READ
  await t.test('GET /admin/etiquetas', async () => {
    // Arrange
    await etiquetasRepository.add({
      nombre: 'Etiqueta List Test ' + Date.now(),
      etiqueta: 'list-test-' + Date.now(),
    });

    // Act
    const res = await app.inject({
      method: 'GET',
      url: '/admin/etiquetas',
    });

    const etiquetas: Etiqueta[] = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.ok(Array.isArray(etiquetas), 'Debería devolver un array');
    assert.ok(etiquetas.length > 0, 'El array no debería estar vacío');
  });

  const etiquetaCreada = await etiquetasRepository.getOneBy({ nombre });

  await t.test(`GET /admin/etiquetas/${etiquetaCreada.id_etiqueta}`, async () => {
    // Act
    const res = await app.inject({
      method: 'GET',
      url: `/admin/etiquetas/${etiquetaCreada.id_etiqueta}`,
    });

    const etiqueta: Etiqueta = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.equal(etiqueta.id_etiqueta, etiquetaCreada.id_etiqueta, 'No coincide el id_etiqueta');
    assert.equal(etiqueta.nombre, nombre, 'No coincide el nombre');
  });

  await t.test(`PUT /admin/etiquetas/${etiquetaCreada.id_etiqueta}`, async () => {
    // Arrange
    const nombreOriginal = 'Original ' + Date.now();
    const slugOriginal = etiquetasRepository.createSlug(nombreOriginal);
    const creada = await etiquetasRepository.add({
      nombre: nombreOriginal,
      etiqueta: slugOriginal,
    });

    const nuevoNombre = 'Actualizada ' + Date.now();

    // Act
    const res = await app.inject({
      method: 'PUT',
      url: `/admin/etiquetas/${creada.id_etiqueta}`,
      payload: {
        ...creada,
        nombre: nuevoNombre,
      },
    });

    const editada: Etiqueta = await etiquetasRepository.getOneBy({ id_etiqueta: creada.id_etiqueta });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    assert.equal(editada.id_etiqueta, creada.id_etiqueta, 'No coincide el ID');
    assert.equal(editada.nombre, nuevoNombre, 'El nombre no se actualizó');
    assert.equal(editada.etiqueta, slugOriginal, 'El slug no debería haber cambiado');
  });

  await t.test('DELETE /:id_etiqueta - debería borrar la etiqueta por ID (204)', async () => {
    // Arrange
    const creada = await etiquetasRepository.add({
      nombre: 'Para Borrar ' + Date.now(),
      etiqueta: 'borrar-' + Date.now(),
    });

    // Act
    const res = await app.inject({
      method: 'DELETE',
      url: `/admin/etiquetas/${creada.id_etiqueta}`,
    });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    assert.equal(res.payload, '', 'El payload debería estar vacío');
  });
});
