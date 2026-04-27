import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../../helper.js';
import authRepository from '@repositories/auth.repository.js';
import { productorRepository } from '@repositories/productor.repository.js';
import { Productor } from '@schemas/productores.schema.js';
import { Producto } from '@schemas/producto.schema.js';
import { productoRepository } from '@repositories/producto.repository.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';

test('/productores', async (t) => {
  const app = await build(t);
  const aleatorio = Date.now();
  const username = 'act-' + aleatorio;
  const email = `${username}@test.com`;
  const emailDuplicado = `dup${username}@test.com`;
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
  await authRepository.register({
    email: emailDuplicado,
    nombres: 'Test',
    apellidos: 'Productores',
    username: `r-${aleatorio}`,
    celular: `+5${aleatorio}`,
    password: 'Contraseña.1',
    password2: 'Contraseña.1',
    roles: ['PRODUCTOR'],
    productor: { presentacion: 'La presentacion.' },
  });
  const categoria: Categoria = await categoriasRepository.add({
    nombre: 'cat' + aleatorio,
    slug_categoria: '',
    descripcion: 'la descripcion',
  });
  const subcategoria: Subcategoria = await subcategoriasRepository.add({
    id_categoria: categoria.id_categoria,
    nombre: 'sub' + aleatorio,
    slug_subcategoria: '',
  });
  const productorCreado: Productor = await productorRepository.getOneBy({ email });
  productorCreado.foto_url = 'http://algo.com/foto.jpg';

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
  const productoB: Producto = await productoRepository.add({
    id_subcategoria: subcategoria.id_subcategoria,
    id_productor: productorCreado.id_productor,
    nombre: 'Producto B ' + aleatorio,
    descripcion: 'La descripcion',
    slug_producto: '',
    precio: 100,
    cantidad_disponible: 10,
    fotos: ['no-foto'],
  });

  await t.test('GET /productores', async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: '/productores',
    });

    const productores: Productor[] = JSON.parse(res.payload);
    const productorBuscado = productores.find((p) => p.id_productor === productorCreado.id_productor);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(productores), 'El resultado debe ser un array');
    assert.ok(productores.length > 0, 'El array debería tener al menos un elemento');
    assert.ok(productorBuscado, 'Debería existir el productor');
  });

  await t.test('GET /productores/:username', async () => {
    //ACT
    const res = await app.inject({
      method: 'GET',
      url: `/productores/${username}`,
    });

    const productor: Productor = JSON.parse(res.payload);

    //ASSERT
    assert.equal(res.statusCode, 200);
    assert.equal(productor.id_productor, productorCreado.id_productor);
    assert.equal(productor.email, productorCreado.email);
    assert.equal(productor.username, productorCreado.username);
  });

  await t.test('PUT /productores/:id_productor', async () => {
    //Arrange
    const nuevoNombre = 'Nombre cambiado.';
    const nuevaPresentacion = 'Nombre cambiado.';

    //ACT
    const res = await app.inject({
      method: 'PUT',
      url: `/productores/${productorCreado.id_productor}`,
      payload: {
        ...productorCreado,
        nombres: nuevoNombre,
        presentacion: nuevaPresentacion,
      },
    });
    const productorModificado: Productor = await productorRepository.getOneBy({
      id_productor: productorCreado.id_productor,
    });
    //ASSERT
    assert.equal(res.statusCode, 204);
    assert.equal(productorModificado.id_productor, productorCreado.id_productor);
    assert.equal(productorModificado.nombres, nuevoNombre);
    assert.equal(productorModificado.presentacion, nuevaPresentacion);
  });

  await t.test('PUT /productores/:id_productor', async () => {
    //Arrange
    const nuevoNombre = 'Nombre cambiado.';
    const nuevaPresentacion = 'Nombre cambiado.';

    //ACT
    const res = await app.inject({
      method: 'PUT',
      url: `/productores/${productorCreado.id_productor}`,
      payload: {
        ...productorCreado,
        email: emailDuplicado,
        nombres: nuevoNombre,
        presentacion: nuevaPresentacion,
      },
    });
    const payload = JSON.parse(res.payload);
    //ASSERT
    assert.equal(res.statusCode, 500);
    assert.equal(payload.statusCode, 500);
  });

  await t.test('DELETE /productores/:id_productor', async () => {
    //Arrange

    //ACT
    const res = await app.inject({
      method: 'DELETE',
      url: `/productores/${productorCreado.id_productor}`,
    });
    const productorModificado: any = await productorRepository.getOneBy({
      id_productor: productorCreado.id_productor,
    });
    //ASSERT
    assert.equal(res.statusCode, 204);
    assert.equal(productorModificado.activo, false);
  });
});
