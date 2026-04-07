import { test } from 'node:test';
import * as assert from 'node:assert';
import { categoriasRepository } from '../../src/repositories/categorias.repository.js';

test('test getAll', async (t) => {
  //Arrange
  const categoria = {
    nombre: 'Nombre ' + Date.now(),
    descripcion: 'Descripcion' + Date.now(),
  };

  //Act
  await categoriasRepository.add(categoria);
  const categorias = await categoriasRepository.getAll();

  //Assert
  assert.equal(true, categorias.length > 0);
});

test('test getOnBy', async (t) => {
  //Arrange
  const categoria = {
    nombre: 'Nombre ' + Date.now(),
    descripcion: 'Descripcion' + Date.now(),
  };

  //Act
  const nuevaCategoria = await categoriasRepository.add(categoria);
  const categoriaOne = await categoriasRepository.getOneBy({ id_categoria: nuevaCategoria.id_categoria });

  //Assert
  assert.deepStrictEqual(nuevaCategoria, categoriaOne);
});

test('test getOnBy varios resultados', async (t) => {
  //Arrange
  const categoria1 = {
    nombre: 'Nombre ' + Date.now(),
    descripcion: 'Descripcion' + Date.now(),
  };
  const categoria2 = {
    nombre: 'Nombre2 ' + Date.now(),
    descripcion: 'Descripcion2' + Date.now(),
  };

  //Act
  const nuevaCategoria1 = await categoriasRepository.add(categoria1);
  const nuevaCategoria2 = await categoriasRepository.add(categoria2);

  await assert.rejects(categoriasRepository.getOneBy({ activo: true }));
});

test('test add', async (t) => {
  //Arrange
  const categoria = {
    nombre: 'Nombre ' + Date.now(),
    descripcion: 'Descripcion' + Date.now(),
  };

  //Act
  const nuevaCategoria = await categoriasRepository.add(categoria);
  const existe = await categoriasRepository.exists(nuevaCategoria.id_categoria);

  //Assert
  assert.equal(true, existe);
});

test('test remove', async (t) => {
  //Arrange
  const categoria = {
    nombre: 'Nombre ' + Date.now(),
    descripcion: 'Descripcion' + Date.now(),
  };

  //act
  const nuevaCategoria = await categoriasRepository.add(categoria);
  categoriasRepository.remove(nuevaCategoria.id_categoria);
  const existe = await categoriasRepository.exists(nuevaCategoria.id_categoria);

  //Assert
  assert.equal(false, existe);
});
