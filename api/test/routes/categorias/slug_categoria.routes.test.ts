import { test } from 'node:test';
import * as assert from 'node:assert';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { build } from '../../helper.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';

test('/categorias/:slug_categoria', async (t) => {
  const app = await build(t);

  await t.test('GET /categorias/:slug_categoria', async () => {
    const nombre = 'slug cat ' + Date.now();
    const slug_categoria = categoriasRepository.createSlug(nombre);

    await categoriasRepository.add({
      nombre,
      slug_categoria,
      descripcion: 'Descripción slug test',
    });

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
    const nombre = 'slug cat ' + Date.now();
    const slug_categoria = categoriasRepository.createSlug(nombre);

    const categoriaCreada = await categoriasRepository.add({
      nombre,
      slug_categoria,
      descripcion: 'Descripción slug test',
    });

    const slug_subcategoria = subcategoriasRepository.createSlug(nombre);

    await subcategoriasRepository.add({
      id_categoria: categoriaCreada.id_categoria,
      nombre,
      slug_subcategoria,
    });

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
    //Arrange
    const nombre = 'slug cat ' + Date.now();
    const slug_categoria = categoriasRepository.createSlug(nombre);
    const categoriaCreada = await categoriasRepository.add({
      nombre,
      slug_categoria,
      descripcion: 'Descripción slug test',
    });
    const slug_subcategoria = slug_categoria;
    await subcategoriasRepository.add({
      id_categoria: categoriaCreada.id_categoria,
      nombre,
      slug_subcategoria,
    });

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
});
