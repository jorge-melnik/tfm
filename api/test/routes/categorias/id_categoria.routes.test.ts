import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';

test('/categorias/:id_categoria', async (t) => {
  const app = await build(t);

  await t.test('PUT /categorias/:id_categoria', async () => {
    // Arrange
    const nombreInicial = 'Cat original ' + Date.now();
    const categoriaCreada = await categoriasRepository.add({
      nombre: nombreInicial,
      descripcion: 'Original',
      slug_categoria: '',
    });
    const nuevoNombre = 'Cat editada ' + Date.now();

    // Act
    const res = await app.inject({
      method: 'PUT',
      url: `/categorias/${categoriaCreada.id_categoria}`,
      payload: {
        ...categoriaCreada,
        nombre: nuevoNombre,
      },
    });

    const categoriaEditada: Categoria = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.equal(categoriaEditada.id_categoria, categoriaCreada.id_categoria, 'No coinciden Ids ');
    assert.equal(categoriaEditada.nombre, nuevoNombre, 'No coincide nombre actualizado');
  });

  await t.test('DELETE /categorias/:id_categoria', async () => {
    // Arrange
    const nombre = 'Cat a borrar ' + Date.now();
    const categoriaCreada = await categoriasRepository.add({
      nombre,
      descripcion: 'Para borrar',
      slug_categoria: '',
    });

    // Act
    const res = await app.inject({
      method: 'DELETE',
      url: `/categorias/${categoriaCreada.id_categoria}`,
    });

    // Assert
    assert.equal(res.statusCode, 204);
    assert.equal(res.payload, ''); // 204 No Content devuelve payload vacío
  });
});
