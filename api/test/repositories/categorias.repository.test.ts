import { test } from 'node:test';
import * as assert from 'node:assert';
import { categoriasRepository } from '../../src/repositories/categorias.repository.js';
import { DeAcaBadRequest, DeAcaInternal, DeAcaNotFound } from '@errors/response.errors.js';

test('Categorias Repository', async (t) => {
  t.test('test getAll', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    await categoriasRepository.add(categoria);
    const categorias = await categoriasRepository.getAll();

    //Assert
    assert.equal(true, categorias.length > 0);
  });

  t.test('test getBy', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    await categoriasRepository.add(categoria);
    const categorias = await categoriasRepository.getBy({ activo: true });

    //Assert
    assert.equal(true, categorias.length > 0);
  });

  t.test('test getBy sin filtro', async () => {
    //Assert
    await assert.rejects(categoriasRepository.getBy({}), (err: any) => {
      assert.ok(err instanceof DeAcaInternal);
      return true;
    });
  });

  t.test('test getOneBy', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    const nuevaCategoria = await categoriasRepository.add(categoria);
    const categoriaOne = await categoriasRepository.getOneBy({ id_categoria: nuevaCategoria.id_categoria });

    //Assert
    assert.deepStrictEqual(nuevaCategoria, categoriaOne);
  });

  t.test('test getOneBy varios resultados', async () => {
    //Arrange
    const nombre1 = 'Nombre ' + Date.now();
    const categoria1 = {
      nombre: nombre1,
      slug_categoria: categoriasRepository.createSlug(nombre1),
      descripcion: 'Descripcion' + Date.now(),
    };
    const nombre2 = 'Nombre2 ' + Date.now();
    const categoria2 = {
      nombre: nombre2,
      slug_categoria: categoriasRepository.createSlug(nombre2),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    await categoriasRepository.add(categoria1);
    await categoriasRepository.add(categoria2);

    await assert.rejects(categoriasRepository.getOneBy({ activo: true }), (err: any) => {
      assert.ok(err instanceof DeAcaInternal);
      return true;
    });
  });

  t.test('test getOneBy sin filtro', async () => {
    //Assert
    await assert.rejects(categoriasRepository.getOneBy({}), (err: any) => {
      assert.ok(err instanceof DeAcaBadRequest);
      return true;
    });
  });

  t.test('test add', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    const nuevaCategoria = await categoriasRepository.add(categoria);
    const existe = await categoriasRepository.exists(nuevaCategoria.id_categoria);

    //Assert
    assert.equal(true, existe);
  });

  t.test('test update', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    const nuevaCategoria = await categoriasRepository.add(categoria);
    nuevaCategoria.nombre = nuevaCategoria.nombre + ' cambiado';
    const categoriaModificada = await categoriasRepository.update(
      nuevaCategoria.id_categoria,
      nuevaCategoria,
    );

    //Assert
    assert.deepStrictEqual(nuevaCategoria, categoriaModificada);
  });

  t.test('test update sin filtro', async () => {
    //Assert
    await assert.rejects(categoriasRepository.update(-1, {}), (err: any) => {
      assert.ok(err instanceof DeAcaBadRequest);
      return true;
    });
  });

  t.test('test update inexistente', async () => {
    //Assert
    await assert.rejects(categoriasRepository.update(-1, { nombre: 'Otro nombre' }), (err: any) => {
      assert.ok(err instanceof DeAcaNotFound);
      return true;
    });
  });

  t.test('test update inexistente 2', async () => {
    //Arrange
    const nombre = 'Nombre u ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //Act
    const nuevaCategoria = await categoriasRepository.add(categoria);
    nuevaCategoria.nombre = nuevaCategoria.nombre + ' cambiado';

    //Assert
    await assert.rejects(categoriasRepository.update(-1, nuevaCategoria), (err: any) => {
      assert.ok(err instanceof DeAcaNotFound);
      return true;
    });
  });

  t.test('test update sin datos', async () => {
    //Assert
    await assert.rejects(categoriasRepository.update(-1, {}), (err: any) => {
      assert.ok(err instanceof DeAcaBadRequest);
      return true;
    });
  });

  t.test('test remove', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };

    //act
    const nuevaCategoria = await categoriasRepository.add(categoria);
    categoriasRepository.remove(nuevaCategoria.id_categoria);
    const existe = await categoriasRepository.exists(nuevaCategoria.id_categoria);

    //Assert
    assert.equal(false, existe);
  });

  t.test('test remove inexistente', async () => {
    //Assert
    await assert.rejects(categoriasRepository.remove(-1), (err: any) => {
      assert.ok(err instanceof DeAcaNotFound);
      return true;
    });
  });

  t.test('test getCount', async () => {
    //Arrange
    const nombre = 'Nombre ' + Date.now();
    const categoria = {
      nombre,
      slug_categoria: categoriasRepository.createSlug(nombre),
      descripcion: 'Descripcion' + Date.now(),
    };
    const contadorAnterior = await categoriasRepository.getCount();
    await categoriasRepository.add(categoria);

    //Act
    const contadorActual = await categoriasRepository.getCount();

    //Assert
    assert.ok(contadorActual >= contadorAnterior + 1);
  });
});
