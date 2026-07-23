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
import { build } from '../../helper.js';
import { DeAcaNotFound } from '@errors/response.errors.js';

const baseUrl = '/productos';

test('Producto Repository', async (t) => {
  const app = await build(t);
  const aleatorio = Date.now();
  const username = `pro-${aleatorio}`;
  const email = `${username}@test.com`;

  await authRepository.register({
    email,
    nombres: 'Test',
    apellidos: 'Productores',
    username,
    celular: `+5${aleatorio}`,
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
    nombre: 'prod' + aleatorio,
    slug_subcategoria: '',
  });
  const productorCreado: Productor = await productorRepository.getOneBy({ email });

  const datosA = {
    id_subcategoria: subcategoria.id_subcategoria,
    id_productor: productorCreado.id_productor,
    nombre: 'Prod A ' + aleatorio,
    descripcion: 'La descripcion',
    slug_producto: '',
    precio: 100,
    cantidad_disponible: 10,
  };
  const productoA: Producto = await productoRepository.add(datosA);
  const productoB: Producto = await productoRepository.add({
    id_subcategoria: subcategoria.id_subcategoria,
    id_productor: productorCreado.id_productor,
    nombre: 'Prod B ' + aleatorio,
    descripcion: 'La descripcion',
    slug_producto: '',
    precio: 100,
    cantidad_disponible: 10,
  });

  const etiqueta1 = await etiquetasRepository.add({ nombre: `prods-1${aleatorio}`, slug_etiqueta: '' });
  const etiqueta2 = await etiquetasRepository.add({ nombre: `prods-2${aleatorio}`, slug_etiqueta: '' });
  await productoRepository.addEtiquetas(productoA.id_producto, [
    etiqueta1.id_etiqueta,
    etiqueta2.id_etiqueta,
  ]);

  await t.test('GET /productos', async () => {
    //ACT
    const url = `${baseUrl}?id_productor=${productorCreado.id_productor}`;
    const res = await app.inject({
      method: 'GET',
      url,
    });

    const productos: Producto[] = JSON.parse(res.payload).data;

    const productoBuscadoA = productos.find((p) => p.id_producto === productoA.id_producto);
    const productoBuscadoB = productos.find((p) => p.id_producto === productoB.id_producto);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.equal(productoBuscadoA?.id_productor, productorCreado.id_productor);
    assert.equal(productoBuscadoA?.id_producto, productoA.id_producto);
    assert.equal(productoBuscadoB?.id_productor, productorCreado.id_productor);
    assert.equal(productoBuscadoB?.id_producto, productoB.id_producto);
  });

  await t.test(`POST /productos`, async () => {
    //Arrange
    const nombre = 'Prod C ' + aleatorio;
    //ACT
    const res = await app.inject({
      method: 'POST',
      url: `${baseUrl}`,
      payload: {
        id_subcategoria: subcategoria.id_subcategoria,
        id_productor: productorCreado.id_productor,
        nombre,
        descripcion: 'La descripcion',
        slug_producto: '',
        precio: 100,
        cantidad_disponible: 10,
        id_etiquetas: [etiqueta1.id_etiqueta],
        fotos: ['no-foto'],
      },
    });

    const producto: Producto = JSON.parse(res.payload);
    //ASSERT
    assert.equal(res.statusCode, 201);
    assert.equal(producto?.nombre, nombre);
  });

  //POST fallido
  await t.test(`POST ${baseUrl}`, async () => {
    //Arrange
    const nombre = 'Prod C ' + aleatorio;
    //ACT
    const res = await app.inject({
      method: 'POST',
      url: `${baseUrl}`,
      payload: {
        id_subcategoria: subcategoria.id_subcategoria,
        id_productor: productorCreado.id_productor,
        nombre,
        descripcion: 'La descripcion',
        slug_producto: '',
        precio: 100,
        cantidad_disponible: 10,
        id_etiquetas: [-4],
        fotos: ['no-foto'],
      },
    });

    //ASSERT
    assert.equal(res.statusCode, 500);
  });

  await t.test(`PUT ${baseUrl}/${productoA.slug_producto}`, async () => {
    //Arrange
    const nombre = 'Prod Cambiado ' + aleatorio;
    //ACT
    const res = await app.inject({
      method: 'PUT',
      url: `${baseUrl}/${productoA.slug_producto}`,
      payload: {
        ...datosA,
        nombre,
        id_productor: productoA.id_productor,
        id_producto: productoA.id_producto,
      },
    });

    const productoACambiado = await productoRepository.getOneBy({
      id_productor: productoA.id_productor,
      id_producto: productoA.id_producto,
    });

    //ASSERT
    assert.equal(res.statusCode, 204);
    assert.equal(productoACambiado?.nombre, nombre);
    assert.equal(productoACambiado?.slug_producto, productoA.slug_producto);
  });

  await t.test(`DELETE ${baseUrl}/${productoB.slug_producto}`, async () => {
    //ACT
    const res = await app.inject({
      method: 'DELETE',
      url: `${baseUrl}/${productoB.slug_producto}`,
    });

    //ASSERT
    assert.equal(res.statusCode, 204);
    await assert.rejects(
      productoRepository.getOneBy({
        id_productor: productoB.id_productor,
        id_producto: productoB.id_producto,
      }),
      (err: any) => {
        assert.ok(err instanceof DeAcaNotFound);
        return true;
      },
    );
  });

  //desactivar.
  await t.test(`PATCH ${baseUrl}/${productoA.slug_producto}`, async () => {
    //ACT
    const res = await app.inject({
      method: 'PATCH',
      url: `${baseUrl}/${productoA.slug_producto}`,
      payload: {
        activo: false,
        id_productor: productoA.id_productor,
        id_producto: productoA.id_producto,
      },
    });
    const productoACambiado: Producto = await productoRepository.getOneBy({
      id_productor: productoA.id_productor,
      id_producto: productoA.id_producto,
    });

    //ASSERT
    assert.equal(res.statusCode, 204);
    assert.equal(productoACambiado?.activo, false);
  });

  //activar.
  await t.test(`PATCH ${baseUrl}/${productoA.slug_producto}`, async () => {
    //ACT
    const res = await app.inject({
      method: 'PATCH',
      url: `${baseUrl}/${productoA.slug_producto}`,
      payload: {
        activo: true,
        id_productor: productoA.id_productor,
        id_producto: productoA.id_producto,
      },
    });
    const productoACambiado: Producto = await productoRepository.getOneBy({
      id_productor: productoA.id_productor,
      id_producto: productoA.id_producto,
    });

    //ASSERT
    assert.equal(res.statusCode, 204);
    assert.equal(productoACambiado?.activo, true);
  });

  //etiquetas
  await t.test(`PATCH ${baseUrl}/${productoA.slug_producto}/etiquetas`, async () => {
    //ARRANGE:
    const etiqueta3 = await etiquetasRepository.add({ nombre: `prods-3${aleatorio}`, slug_etiqueta: '' });

    //ACT
    const res = await app.inject({
      method: 'PATCH',
      url: `${baseUrl}/${productoA.slug_producto}/etiquetas`,
      payload: {
        id_productor: productoA.id_productor,
        id_producto: productoA.id_producto,
        ids_borrar: [etiqueta1.id_etiqueta],
        ids_agregar: [etiqueta3.id_etiqueta],
      },
    });
    const productoACambiado: Producto = await productoRepository.getOneBy({
      id_productor: productoA.id_productor,
      id_producto: productoA.id_producto,
    });

    //ASSERT
    assert.equal(res.statusCode, 204);
    assert.equal(productoACambiado?.id_etiquetas.length, 2);
    assert.deepStrictEqual(productoACambiado?.id_etiquetas, [etiqueta2.id_etiqueta, etiqueta3.id_etiqueta]);
  });

  //etiquetas que falla
  await t.test(`PATCH ${baseUrl}}/${productoA.slug_producto}/etiquetas`, async () => {
    //ACT
    const res = await app.inject({
      method: 'PATCH',
      url: `${baseUrl}/${productoA.slug_producto}/etiquetas`,
      payload: {
        id_productor: productoA.id_productor,
        id_producto: productoA.id_producto,
        ids_borrar: [],
        ids_agregar: [-1, -2],
      },
    });

    //ASSERT
    assert.equal(res.statusCode, 500);
  });
});
