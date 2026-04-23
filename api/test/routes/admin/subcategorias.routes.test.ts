import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria, Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';

test('/admin/categorias/:id_categoria/subcategorias', async (t) => {
  const app = await build(t);
  const nombre = 'SUB ' + Date.now();
  const datosCategoria = {
    nombre,
    descripcion: 'Descripcion ' + Date.now(),
    slug_categoria: '',
  };
  const datosSubcategoria = {
    nombre,
    slug_subcategoria: '',
  };

  const categoriaPadre = await categoriasRepository.add(datosCategoria); //Asumimos que esto funciona.

  //CREATE
  await t.test(`POST /admin/categorias/${categoriaPadre.id_categoria}/subcategorias`, async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: `/admin/categorias/${categoriaPadre.id_categoria}/subcategorias`,
      payload: datosSubcategoria,
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
    assert.equal(
      subcategoriaCreada.nombre,
      datosSubcategoria.nombre,
      'No coincide el nombre de la subcategoria',
    );
  });

  // READ:
  await t.test(`GET /admin/categorias/${categoriaPadre.id_categoria}/subcategorias`, async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: `/admin/categorias/${categoriaPadre.id_categoria}/subcategorias`,
    });

    const subcategorias: Subcategoria[] = JSON.parse(res.payload);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(subcategorias), 'El resultado debe ser un array');
    assert.ok(subcategorias.length > 0, 'El array debería tener al menos un elemento');
  });

  //Para usar en los tests de abajo
  const subcategoriaCreada = await subcategoriasRepository.getOneBy({ nombre: datosSubcategoria.nombre });

  //READ
  await t.test(
    `GET /admin/categorias/${categoriaPadre.id_categoria}/subcategorias/${subcategoriaCreada}`,
    async () => {
      //ACT
      const res = await app.inject({
        method: 'GET',
        url: `/admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria}`,
      });

      const subcategoria: Subcategoria = JSON.parse(res.payload);

      //Assert
      assert.equal(res.statusCode, 200);
      assert.equal(subcategoria.id_categoria, subcategoriaCreada.id_categoria);
      assert.equal(subcategoria.nombre, subcategoriaCreada.nombre);
      assert.equal(subcategoria.slug_categoria, subcategoriaCreada.slug_categoria);
    },
  );

  //UPDATE:
  await t.test(
    `PUT /admin/categorias/${categoriaPadre.id_categoria}/subcategorias/${subcategoriaCreada}`,
    async () => {
      // Arrange
      const nuevoNombre = 'Subcat editada ' + Date.now();

      // Act
      const res = await app.inject({
        method: 'PUT',
        url: `/admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria}`,
        payload: {
          ...subcategoriaCreada,
          nombre: nuevoNombre,
        },
      });

      const subcategoriaEditada: Subcategoria = JSON.parse(res.payload);

      // Assert
      assert.equal(res.statusCode, 200, 'No coincide statusCode');
      assert.equal(subcategoriaEditada.id_categoria, subcategoriaCreada.id_categoria, 'No coinciden Ids ');
      assert.equal(
        subcategoriaEditada.id_subcategoria,
        subcategoriaCreada.id_subcategoria,
        'No coinciden Ids ',
      );
      assert.equal(subcategoriaEditada.nombre, nuevoNombre, 'No coincide nombre actualizado');
    },
  );

  //DESACTIVAR
  await t.test(
    `PATCH /admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria} (desactivar)`,
    async () => {
      // Act
      const res = await app.inject({
        method: 'PATCH',
        url: `/admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria}`,
        payload: {
          activo: false,
        },
      });

      // Assert
      assert.equal(res.statusCode, 204, 'No coincide statusCode');
      const subcategoriaDesactivada = await subcategoriasRepository.getOneBy({
        id_subcategoria: subcategoriaCreada.id_subcategoria,
      });

      assert.equal(subcategoriaDesactivada.activo, false);
    },
  );

  //ACTIVAR
  await t.test(
    `PATCH /admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria} (activar)`,
    async () => {
      // Act
      const res = await app.inject({
        method: 'PATCH',
        url: `/admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria}`,
        payload: {
          activo: true,
        },
      });

      // Assert
      assert.equal(res.statusCode, 204, 'No coincide statusCode');
      const subcategoriaActivada = await subcategoriasRepository.getOneBy({
        id_subcategoria: subcategoriaCreada.id_subcategoria,
      });

      assert.equal(subcategoriaActivada.activo, true);
    },
  );

  //DELETE
  await t.test(
    `DELETE /admin/categorias/${categoriaPadre.id_categoria}/subcategorias/${subcategoriaCreada}`,
    async () => {
      // Act
      const res = await app.inject({
        method: 'DELETE',
        url: `/admin/categorias/${subcategoriaCreada.id_categoria}/subcategorias/${subcategoriaCreada.id_subcategoria}`,
      });

      // Assert
      assert.equal(res.statusCode, 204);
      assert.equal(res.payload, ''); // 204 No Content devuelve payload vacío
    },
  );

  //DELETE categoria
  await t.test(`DELETE /admin/categorias/${categoriaPadre.id_categoria}`, async () => {
    // Arrange
    const categoriaCreada = await categoriasRepository.getOneBy({ nombre: datosCategoria.nombre });

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

//Etiquetas de subcategoria
test('/admin/categorias/:id_categoria/subcategorias/:id_subcategoria/etiquetas', async (t) => {
  const app = await build(t);
  const nombre = 'pruebaetiqta ' + Date.now();

  // Arrange
  const categoriaPadre: Categoria = await categoriasRepository.add({
    nombre,
    descripcion: 'Desc ' + Date.now(),
    slug_categoria: '',
  });

  const subcategoria: Subcategoria = await subcategoriasRepository.add({
    id_categoria: categoriaPadre.id_categoria,
    nombre: 'Sub ' + nombre,
    slug_subcategoria: '',
  });

  const etiqueta = await etiquetasRepository.add({ nombre, slug_etiqueta: '' });
  const idEtiquetaPrueba = etiqueta.id_etiqueta;
  const baseUrl = `/admin/categorias/${categoriaPadre.id_categoria}/subcategorias/${subcategoria.id_subcategoria}/etiquetas`;

  // ADD (POST)
  await t.test(`POST ${baseUrl}`, async () => {
    // Act
    const res = await app.inject({
      method: 'POST',
      url: baseUrl,
      payload: { id_etiqueta: idEtiquetaPrueba },
    });

    const resGet = await app.inject({ method: 'GET', url: baseUrl });
    const etiquetas: Etiqueta[] = JSON.parse(resGet.payload);
    const existeEnLista = etiquetas.some((e) => e.id_etiqueta === idEtiquetaPrueba);

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode en POST');
    assert.ok(existeEnLista, 'La etiqueta debería estar en la lista después del POST');
  });

  // READ (GET)
  await t.test(`GET ${baseUrl}`, async () => {
    // Act
    const res = await app.inject({
      method: 'GET',
      url: baseUrl,
    });

    const etiquetas: Etiqueta[] = JSON.parse(res.payload);

    // Assert
    assert.equal(res.statusCode, 200, 'No coincide statusCode en GET');
    assert.ok(Array.isArray(etiquetas), 'El resultado debe ser un array');
    assert.ok(etiquetas.length > 0, 'El array debería tener al menos la etiqueta insertada');
  });

  // REMOVE (DELETE)
  // Nota: Asumo que la ruta es DELETE /:id_etiqueta según tu handler
  await t.test(`DELETE ${baseUrl}/${idEtiquetaPrueba}`, async () => {
    // Act
    const res = await app.inject({
      method: 'DELETE',
      url: `${baseUrl}/${idEtiquetaPrueba}`,
    });

    // Verificación de estado
    const resGet = await app.inject({ method: 'GET', url: baseUrl });
    const etiquetas: Etiqueta[] = JSON.parse(resGet.payload);
    const existeEnLista = etiquetas.some((e) => e.id_etiqueta === idEtiquetaPrueba);

    // Assert
    assert.equal(res.statusCode, 204, 'No coincide statusCode en DELETE');
    assert.equal(res.payload, '', 'El payload de 204 debe ser vacío');
    assert.strictEqual(existeEnLista, false, 'La etiqueta NO debería estar en la lista después del DELETE');
  });
});
