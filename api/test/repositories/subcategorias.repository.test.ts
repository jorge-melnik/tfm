import { test } from 'node:test';
import * as assert from 'node:assert';
import { categoriasRepository } from '../../src/repositories/categorias.repository.js';
import { Categoria } from '@schemas/categoria.schema.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { DeAcaNotFound } from '@errors/response.errors.js';

test('Subcategorias Repository', async (t) => {
  t.test('test getCount', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria: Categoria = await categoriasRepository.add({
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    });
    const cantidadAnterior = await subcategoriasRepository.getCount(true);
    await subcategoriasRepository.add({
      id_categoria: categoria.id_categoria,
      nombre,
      slug_subcategoria: subcategoriasRepository.createSlug(nombre),
    });
    const cantidadActual = await subcategoriasRepository.getCount(true);

    //Assert
    assert.equal(cantidadActual, cantidadAnterior + 1);
  });

  t.test('test deactivate', async () => {
    //Arrange
    const nombre = 'Nombre deactivate' + Date.now();
    const categoria: Categoria = await categoriasRepository.add({
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    });

    const subcategoria = await subcategoriasRepository.add({
      id_categoria: categoria.id_categoria,
      nombre,
      slug_subcategoria: subcategoriasRepository.createSlug(nombre),
    });

    await subcategoriasRepository.deactivate(subcategoria.id_subcategoria);
    const subcategoriaDesactivada = await subcategoriasRepository.getOneBy({
      id_subcategoria: subcategoria.id_subcategoria,
    });
    subcategoria.activo = false;

    //Assert
    assert.equal(subcategoria.activo, subcategoriaDesactivada.activo);
  });

  t.test('test deactivate id no existente', async () => {
    await assert.rejects(subcategoriasRepository.deactivate(-1), (err: any) => {
      assert.ok(err instanceof DeAcaNotFound);
      return true;
    });
  });

  t.test('test activate id no existente', async () => {
    await assert.rejects(subcategoriasRepository.activate(-1), (err: any) => {
      assert.ok(err instanceof DeAcaNotFound);
      return true;
    });
  });

  t.test('test activate', async () => {
    //Arrange
    const nombre = 'Nombre activate ' + Date.now();
    const categoria: Categoria = await categoriasRepository.add({
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    });

    const subcategoria = await subcategoriasRepository.add({
      id_categoria: categoria.id_categoria,
      nombre,
      slug_subcategoria: subcategoriasRepository.createSlug(nombre),
    });

    await subcategoriasRepository.deactivate(subcategoria.id_subcategoria);
    await subcategoriasRepository.getOneBy({
      id_subcategoria: subcategoria.id_subcategoria,
    });

    await subcategoriasRepository.activate(subcategoria.id_subcategoria);
    const subcategoriaActivada = await subcategoriasRepository.getOneBy({
      id_subcategoria: subcategoria.id_subcategoria,
    });

    //Assert
    assert.equal(subcategoria.activo, subcategoriaActivada.activo);
  });
});
