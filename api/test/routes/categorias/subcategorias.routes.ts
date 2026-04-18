import { test } from 'node:test';
import * as assert from 'node:assert';
import { Subcategoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';

test('/categorias/:id_categoria/subcategorias', async (t) => {
  const app = await build(t);

  await t.test('POST / - debería crear una subcategoría exitosamente', async () => {
    // Arrange
    const nombreCat = 'Cat Padre ' + Date.now();
    const categoriaPadre = await categoriasRepository.add({
      nombre: nombreCat,
      descripcion: 'Categoria para test de subcat',
      slug_categoria: '',
    });

    const nombreSub = 'Subcategoria ' + Date.now();

    // Act
    const res = await app.inject({
      method: 'POST',
      url: `/categorias/${categoriaPadre.id_categoria}/subcategorias`,
      payload: {
        nombre: nombreSub,
        slug_subcategoria: '',
      },
    });

    const subcategoriaCreada: Subcategoria = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 201, 'No coincide statusCode');
    assert.ok(subcategoriaCreada.id_subcategoria, 'Debería tener id_subcategoria');
    assert.equal(
      subcategoriaCreada.id_categoria,
      categoriaPadre.id_categoria,
      'No coincide el id de categoria padre',
    );
    assert.equal(subcategoriaCreada.nombre, nombreSub, 'No coincide el nombre de la subcategoria');
  });
});
