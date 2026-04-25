import authRepository from '@repositories/auth.repository.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { productoRepository } from '@repositories/producto.repository.js';
import { productorRepository } from '@repositories/productor.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';
import assert from 'node:assert';
import test from 'node:test';

test('Producto Repository', async (t) => {
  const aleatorio = Date.now();
  const username = `pr-${aleatorio}`;
  const email = `${username}@test.com`;

  await authRepository.register({
    email,
    nombres: 'Test',
    apellidos: 'Productores',
    username,
    celular: `+4${aleatorio}`,
    password: 'Contraseña.1',
    password2: 'Contraseña.1',
    roles: ['PRODUCTOR'],
    productor: { presentacion: 'La presentacion.' },
  });

  const categoria: Categoria = await categoriasRepository.add({
    nombre: 'pr' + aleatorio,
    slug_categoria: '',
    descripcion: 'la descripcion',
  });
  const subcategoria: Subcategoria = await subcategoriasRepository.add({
    id_categoria: categoria.id_categoria,
    nombre: 'pr' + aleatorio,
    slug_subcategoria: '',
  });
  const productorCreado: Productor = await productorRepository.getOneBy({ email });

  const productoA: Producto = await productoRepository.add({
    id_subcategoria: subcategoria.id_subcategoria,
    id_productor: productorCreado.id_productor,
    nombre: 'Producto A ' + aleatorio,
    descripcion: 'La descripcion',
    slug_producto: '',
    precio: 100,
    cantidad_disponible: 10,
    fotos: ['no-foto'],
  });

  const etiqueta1 = await etiquetasRepository.add({ nombre: `etpr-1${aleatorio}`, slug_etiqueta: '' });
  const etiqueta2 = await etiquetasRepository.add({ nombre: `etpr-2${aleatorio}`, slug_etiqueta: '' });

  await t.test('addEtiquetas vacio', async () => {
    //ACT
    await productoRepository.addEtiquetas(productorCreado.id_productor, productoA.id_producto, []);
    const productoModificado = await productoRepository.getOneBy({
      id_productor: productorCreado.id_productor,
      id_producto: productoA.id_producto,
    });
    assert.equal(productoModificado.id_etiquetas.length, 0);
  });
  await t.test('removeEtiquetas vacio', async () => {
    //ACT
    await productoRepository.removeEtiquetas(productorCreado.id_productor, productoA.id_producto, []);
    const productoModificado = await productoRepository.getOneBy({
      id_productor: productorCreado.id_productor,
      id_producto: productoA.id_producto,
    });
    assert.equal(productoModificado.id_etiquetas.length, 0);
  });

  await t.test('addEtiquetas', async () => {
    //Arrange
    const arrayAgregar = [etiqueta1.id_etiqueta, etiqueta2.id_etiqueta];

    //ACT
    await productoRepository.addEtiquetas(productorCreado.id_productor, productoA.id_producto, arrayAgregar);
    const productoModificado = await productoRepository.getOneBy({
      id_productor: productorCreado.id_productor,
      id_producto: productoA.id_producto,
    });
    assert.deepStrictEqual(productoModificado.id_etiquetas, arrayAgregar);
  });

  await t.test('addEtiquetas', async () => {
    //ACT
    await productoRepository.removeEtiquetas(productorCreado.id_productor, productoA.id_producto, [
      etiqueta1.id_etiqueta,
    ]);
    const productoModificado = await productoRepository.getOneBy({
      id_productor: productorCreado.id_productor,
      id_producto: productoA.id_producto,
    });
    assert.deepStrictEqual(productoModificado.id_etiquetas, [etiqueta2.id_etiqueta]);
  });
});
