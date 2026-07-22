import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria } from '@schemas/categoria.schema.js';
import { build } from '../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';

test('/admin/categorias', async (t) => {
  const app = await build(t);
  const nombre = 'NombrePOST ' + Date.now();
  const datosCategoria = {
    nombre,
    descripcion: 'Descripcion ' + Date.now(),
    slug_categoria: '',
  };

  // CREATE:
  await t.test('POST /admin/categorias - debería crear una categoría con éxito', async () => {
    //Act
    const res = await app.inject({
      method: 'POST',
      url: '/admin/categorias',
      payload: datosCategoria,
    });

    const categoriaCreada: Categoria = JSON.parse(res.payload);

    //assert
    assert.equal(res.statusCode, 201);
    assert.ok(categoriaCreada.id_categoria, 'Debería devolver un ID generado');
    assert.equal(categoriaCreada.nombre, nombre);
    assert.ok(categoriaCreada.slug_categoria, 'El slug debería haberse generado automáticamente');
  });

  // READ:
  await t.test('GET /admin/categorias', async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: '/admin/categorias',
    });

    const categorias: Categoria[] = JSON.parse(res.payload);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(categorias), 'El resultado debe ser un array');
    assert.ok(categorias.length > 0, 'El array debería tener al menos un elemento');
  });

  const categoriaCreada = await categoriasRepository.getOneBy({ nombre: datosCategoria.nombre });

  //READ
  await t.test(`GET /admin/categorias/${categoriaCreada.id_categoria}`, async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: '/admin/categorias/' + categoriaCreada.id_categoria,
    });

    const categoria: Categoria = JSON.parse(res.payload);

    //Assert
    assert.equal(res.statusCode, 200);
    assert.equal(categoria.id_categoria, categoriaCreada.id_categoria);
    assert.equal(categoria.nombre, categoriaCreada.nombre);
    assert.equal(categoria.slug_categoria, categoriaCreada.slug_categoria);
  });

  //UPDATE:
  await t.test(`PUT /admin/categorias/${categoriaCreada.id_categoria}`, async () => {
    // Arrange
    const nuevoNombre = 'Cat editada ' + Date.now();

    // Act
    const res = await app.inject({
      method: 'PUT',
      url: `/admin/categorias/${categoriaCreada.id_categoria}`,
      payload: {
        ...categoriaCreada,
        nombre: nuevoNombre,
      },
    });

    const categoriaEditada: Categoria = await categoriasRepository.getOneBy({
      id_categoria: categoriaCreada.id_categoria,
    });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    assert.equal(categoriaEditada.id_categoria, categoriaCreada.id_categoria, 'No coinciden Ids ');
    assert.equal(categoriaEditada.nombre, nuevoNombre, 'No coincide nombre actualizado');
  });

  //DESACTIVAR
  await t.test(`PATCH /admin/categorias/${categoriaCreada.id_categoria} (desactivar)`, async () => {
    // Act
    const res = await app.inject({
      method: 'PATCH',
      url: `/admin/categorias/${categoriaCreada.id_categoria}`,
      payload: {
        activo: false,
      },
    });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    const categoriaDesactivada = await categoriasRepository.getOneBy({
      id_categoria: categoriaCreada.id_categoria,
    });

    assert.equal(categoriaDesactivada.activo, false);
  });

  //ACTIVAR
  await t.test(`PATCH /admin/categorias/${categoriaCreada.id_categoria} (activar)`, async () => {
    // Act
    const res = await app.inject({
      method: 'PATCH',
      url: `/admin/categorias/${categoriaCreada.id_categoria}`,
      payload: {
        activo: true,
      },
    });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    const categoriaActivada = await categoriasRepository.getOneBy({
      id_categoria: categoriaCreada.id_categoria,
    });

    assert.equal(categoriaActivada.activo, true);
  });

  //DELETE
  await t.test(`DELETE /admin/categorias/${categoriaCreada.id_categoria}`, async () => {
    // Act
    const res = await app.inject({
      method: 'DELETE',
      url: `/admin/categorias/${categoriaCreada.id_categoria}`,
    });

    // Assert
    assert.equal(res.statusCode, 204);
    assert.equal(res.payload, ''); // 204 No Content devuelve payload vacío
  });
});
