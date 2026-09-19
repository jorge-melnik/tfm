import { myPool } from '@database/pool.js';
import { InternalError } from '@errors/response.errors.js';
import authRepository from '@repositories/auth.repository.js';
import { categoriasRepository } from '@repositories/categorias.repository.js';
import { consumidorRepository } from '@repositories/consumidor.repository.js';
import { etiquetasRepository } from '@repositories/etiquetas.repository.js';
import { productoRepository } from '@repositories/producto.repository.js';
import { productorRepository } from '@repositories/productor.repository.js';
import { subcategoriasRepository } from '@repositories/subcategorias.repository.js';
import { Categoria, Subcategoria } from '@schemas/categoria.schema.js';
import { Consumidor, ItemCarrito } from '@schemas/consumidores.schema.js';
import { Producto } from '@schemas/producto.schema.js';
import { Productor } from '@schemas/productores.schema.js';
import assert from 'node:assert';
import test from 'node:test';

const aleatorio = Date.now();
const username1 = `co1${aleatorio}`;
const username2 = `co2${aleatorio}`;
await authRepository.register({
  email: `${username1}@test.com`,
  nombres: 'Test',
  apellidos: 'Activacion',
  username: username1,
  celular: `+56${aleatorio}`,
  password: 'Contraseña.1',
  password2: 'Contraseña.1',
  roles: ['CONSUMIDOR', 'PRODUCTOR'], // Ambos
  consumidor: {},
  productor: { presentacion: 'La presentacion.' },
});

await test('activarConsumidor() y activarProductor() - Casos de error', async (st) => {
  // Obtenemos el id para las pruebas directas
  const { rows } = await myPool.query('SELECT id_usuario FROM datos_personales WHERE email = $1', [
    `${username1}@test.com`,
  ]);
  const { id_usuario } = rows[0];

  await st.test('Debe fallar si se intenta activar un PRODUCTOR que ya existe', async () => {
    // Primero lo activamos una vez exitosamente

    // Act & Assert: Intentamos de nuevo
    await assert.rejects(
      consumidorRepository.activarProductor(id_usuario, {
        presentacion: 'Segunda vez',
      }),
      (err: any) => {
        assert.ok(err instanceof InternalError);
        return true;
      },
    );
  });

  await st.test('Metodo no permitido activate', async () => {
    await assert.rejects(consumidorRepository.activate(id_usuario), (err: any) => {
      assert.ok(err instanceof InternalError);
      return true;
    });
  });
});

await authRepository.register({
  email: `${username2}@test.com`,
  nombres: 'Test',
  apellidos: 'Activacion',
  username: username2,
  celular: `+57${aleatorio}`,
  password: 'Contraseña.1',
  password2: 'Contraseña.1',
  roles: ['PRODUCTOR'], // Solo productor
  consumidor: {},
  productor: { presentacion: 'La presentacion.' },
});

const miConsumidor: Consumidor = await consumidorRepository.getOneBy({ username: username1 });
const miProductor: Productor = await productorRepository.getOneBy({ username: username1 });
const categoria: Categoria = await categoriasRepository.add({
  nombre: 'con1' + aleatorio,
  categoria: '',
  descripcion: 'la descripcion',
});
const subcategoria: Subcategoria = await subcategoriasRepository.add({
  id_categoria: categoria.id_categoria,
  nombre: 'con1' + aleatorio,
  subcategoria: '',
});

const productoA: Producto = await productoRepository.add({
  id_subcategoria: subcategoria.id_subcategoria,
  id_productor: miProductor.id_productor,
  nombre: 'Mi Prod A ' + aleatorio,
  descripcion: 'La descripcion',
  producto: '',
  precio: 100,
  cantidad_disponible: 10,
  fotos: ['no-foto'],
});

const etiqueta1 = await etiquetasRepository.add({ nombre: `con-1${aleatorio}`, etiqueta: '' });
const etiqueta2 = await etiquetasRepository.add({ nombre: `con-2${aleatorio}`, etiqueta: '' });
await productoRepository.addEtiquetas(miProductor.id_productor, productoA.id_producto, [
  etiqueta1.id_etiqueta,
  etiqueta2.id_etiqueta,
]);

const { id_productor, id_producto } = productoA;
const { id_consumidor } = miConsumidor;
const item1 = { id_productor, id_producto, id_consumidor, cantidad: 2 };

await test('CARRITO', async (st) => {
  // Obtenemos el id para las pruebas directas

  await st.test('add ItemCarrito', async () => {
    const itemCreado = await consumidorRepository.addItemCarrito(item1);
    assert.equal(itemCreado.id_productor, item1.id_productor);
    assert.equal(itemCreado.id_producto, item1.id_producto);
    assert.equal(itemCreado.id_consumidor, item1.id_consumidor);
    assert.equal(itemCreado.cantidad, item1.cantidad);
  });

  await st.test('getCarrito', async () => {
    const carrito: ItemCarrito[] = await consumidorRepository.getCarrito(id_consumidor);
    const itemExistente = carrito[0];
    assert.equal(carrito.length, 1);
    assert.equal(itemExistente.id_productor, item1.id_productor);
    assert.equal(itemExistente.id_producto, item1.id_producto);
    assert.equal(itemExistente.id_consumidor, item1.id_consumidor);
    assert.equal(itemExistente.cantidad, item1.cantidad);
  });

  await st.test('update ItemCarrito', async () => {
    const itemCambiado = await consumidorRepository.updateItemCarrito({
      ...item1,
      cantidad: 10,
    });
    assert.equal(itemCambiado.id_productor, item1.id_productor);
    assert.equal(itemCambiado.id_producto, item1.id_producto);
    assert.equal(itemCambiado.id_consumidor, item1.id_consumidor);
    assert.equal(itemCambiado.cantidad, 10);
  });

  await st.test('remove ItemCarrito', async () => {
    await consumidorRepository.removeItemCarrito(item1);
    const carrito: ItemCarrito[] = await consumidorRepository.getCarrito(id_consumidor);
    assert.equal(carrito.length, 0);
  });
});
