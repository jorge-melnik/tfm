import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria, Etiqueta, Subcategoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';

test('/categorias/:slug_categoria', async (t) => {
  //ARRANGE
  const app = await build(t);

  const nombre = 'slug cat ' + Date.now();
  const slug_categoria = categoriasRepository.createSlug(nombre);

  const categoriaCreada = await categoriasRepository.add({
    nombre,
    slug_categoria,
    descripcion: 'Descripción slug test',
  });

  const slug_subcategoria = subcategoriasRepository.createSlug(nombre);

  const subcategoriaCreada = await subcategoriasRepository.add({
    id_categoria: categoriaCreada.id_categoria,
    nombre,
    slug_subcategoria,
  });

  await t.test('GET /categorias/:slug_categoria', async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: `/categorias/${slug_categoria}`,
    });

    const categoria: Categoria = JSON.parse(res.payload);

    assert.equal(res.statusCode, 200);
    assert.equal(categoria.slug_categoria, slug_categoria);
    assert.equal(categoria.nombre, nombre);
  });

  await t.test('GET /categorias/:slug_categoria/subcategorias', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/categorias/${slug_categoria}/subcategorias`,
    });

    const subcategorias: Subcategoria[] = JSON.parse(res.payload);

    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(subcategorias));
    assert.ok(subcategorias.some((s) => s.slug_subcategoria === slug_subcategoria));
  });

  await t.test('GET /categorias/:slug_categoria/subcategorias/:slug_subcategoria', async () => {
    //Act
    const res = await app.inject({
      method: 'GET',
      url: `/categorias/${slug_categoria}/subcategorias/${slug_subcategoria}`,
    });

    const subcategoria: Subcategoria = JSON.parse(res.payload);

    //Assert
    assert.equal(res.statusCode, 200);
    assert.equal(subcategoria.slug_subcategoria, slug_subcategoria);
    assert.equal(subcategoria.id_categoria, categoriaCreada.id_categoria);
  });

  await t.test('GET /categorias/:slug_categoria/subcategorias/:slug_subcategoria/etiquetas', async () => {
    //Arrange
    const nombre = 'etiquetas ' + Date.now();
    const etiquetaCreada = await etiquetasRepository.add({ nombre, slug_etiqueta: '' });
    await subcategoriasRepository.addEtiqueta(
      categoriaCreada.id_categoria,
      subcategoriaCreada.id_subcategoria,
      etiquetaCreada.id_etiqueta,
    );

    //Act
    const res = await app.inject({
      method: 'GET',
      url: `/categorias/${slug_categoria}/subcategorias/${slug_subcategoria}/etiquetas`,
    });

    const etiquetas: Etiqueta[] = JSON.parse(res.payload);

    //Assert
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(etiquetas));
  });
});
