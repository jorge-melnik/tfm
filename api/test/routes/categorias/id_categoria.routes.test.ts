import { test } from 'node:test';
import * as assert from 'node:assert';
import { Subcategoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';

test('/categorias/:id_categoria/subcategorias/:id_subcategoria', async (t) => {
  const app = await build(t);

  await t.test('PUT /categorias/:id_categoria/subcategorias/:id_subcategoria', async () => {
    // Arrange
    const categoriaPadre = await categoriasRepository.add({
      nombre: 'Cat Padre ' + Date.now(),
      descripcion: 'Padre para sub PUT',
      slug_categoria: '',
    });

    const subcategoriaCreada = await subcategoriasRepository.add({
      id_categoria: categoriaPadre.id_categoria,
      nombre: 'Sub original ' + Date.now(),
      slug_subcategoria: '',
    });

    const nuevoNombreSub = 'Sub editada ' + Date.now();

    // Act
    const res = await app.inject({
      method: 'PUT',
      url: `/admin/categorias/${categoriaPadre.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria}`,
      payload: {
        id_subcategoria: subcategoriaCreada.id_subcategoria,
        nombre: nuevoNombreSub,
      },
    });

    const subcategoriaEditada: Subcategoria = JSON.parse(res.payload);
    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode');
    assert.equal(
      subcategoriaEditada.id_subcategoria,
      subcategoriaCreada.id_subcategoria,
      'No coinciden Ids de subcategoría',
    );
    assert.equal(subcategoriaEditada.nombre, nuevoNombreSub, 'No coincide el nombre actualizado');
    assert.equal(
      subcategoriaEditada.id_categoria,
      categoriaPadre.id_categoria,
      'El id_categoria no debería haber cambiado',
    );
  });

  await t.test('DELETE /categorias/:id_categoria/subcategorias/:id_subcategoria', async () => {
    // Arrange
    const categoriaPadre = await categoriasRepository.add({
      nombre: 'Cat Padre ' + Date.now(),
      descripcion: 'Padre para sub DELETE',
      slug_categoria: '',
    });

    const subcategoriaABorrar = await subcategoriasRepository.add({
      id_categoria: categoriaPadre.id_categoria,
      nombre: 'Sub a borrar ' + Date.now(),
      slug_subcategoria: '',
    });

    // Act
    const res = await app.inject({
      method: 'DELETE',
      url: `/admin/categorias/${categoriaPadre.id_categoria}/subcategorias/${subcategoriaABorrar.id_subcategoria}`,
    });

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode');
    assert.equal(res.payload, '', 'El payload debería estar vacío en un 204');
  });
});
