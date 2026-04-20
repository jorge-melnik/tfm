import { test } from 'node:test';
import * as assert from 'node:assert';
import { categoriasRepository } from '../../src/repositories/categorias.repository.js';
import { Categoria } from '@schemas/categoria.schema.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { DeAcaNotFound } from '@errors/response.errors.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';

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

test('Subcategorias Repository (Etiquetas)', async (t) => {
  t.test('addEtiqueta y getEtiquetas', async () => {
    // Arrange
    const nombre = 'CatAdd ' + Date.now();
    const categoria: Categoria = await categoriasRepository.add({
      nombre,
      slug_categoria: '',
      descripcion: 'Desc',
    });

    const subcategoria = await subcategoriasRepository.add({
      id_categoria: categoria.id_categoria,
      nombre: 'Sub ' + nombre,
      slug_subcategoria: '',
    });

    const etiqueta = await etiquetasRepository.add({
      nombre,
      slug_etiqueta: '',
    });

    // Act
    await subcategoriasRepository.addEtiqueta(
      categoria.id_categoria,
      subcategoria.id_subcategoria,
      etiqueta.id_etiqueta,
    );
    const etiquetas = await subcategoriasRepository.getEtiquetas(
      categoria.id_categoria,
      subcategoria.id_subcategoria,
    );

    // Assert
    const encontrada = etiquetas.some((e) => e.id_etiqueta === etiqueta.id_etiqueta);
    assert.ok(encontrada, 'La etiqueta debería haber sido asociada correctamente');
  });

  t.test('test removeEtiqueta', async () => {
    // Arrange
    const nombre = 'Cat Remove ' + Date.now();
    const categoria: Categoria = await categoriasRepository.add({
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Desc',
    });

    const subcategoria = await subcategoriasRepository.add({
      id_categoria: categoria.id_categoria,
      nombre: 'Sub ' + nombre,
      slug_subcategoria: subcategoriasRepository.createSlug('Sub ' + nombre),
    });

    const etiqueta = await etiquetasRepository.add({
      nombre,
      slug_etiqueta: '',
    });
    await subcategoriasRepository.addEtiqueta(
      categoria.id_categoria,
      subcategoria.id_subcategoria,
      etiqueta.id_etiqueta,
    );

    // Act
    await subcategoriasRepository.removeEtiqueta(
      categoria.id_categoria,
      subcategoria.id_subcategoria,
      etiqueta.id_etiqueta,
    );
    const etiquetas = await subcategoriasRepository.getEtiquetas(
      categoria.id_categoria,
      subcategoria.id_subcategoria,
    );

    // Assert
    const encontrada = etiquetas.some((e) => e.id_etiqueta === etiqueta.id_etiqueta);
    assert.strictEqual(encontrada, false, 'La etiqueta no debería existir después de ser removida');
  });
});
