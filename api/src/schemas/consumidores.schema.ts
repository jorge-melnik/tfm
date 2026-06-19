import { Static, Type } from '@sinclair/typebox';
import { AdicionalesConsumidor, DatosPersonales } from './usuarios.schema.js';
import { Producto } from './producto.schema.js';

export const Consumidor = Type.Object({
  ...DatosPersonales.properties,
  ...AdicionalesConsumidor.properties,
  id_consumidor: DatosPersonales.properties.id_usuario,
});

export const ItemCarrito = Type.Object({
  id_productor: DatosPersonales.properties.id_usuario,
  id_producto: Producto.properties.id_producto,
  id_consumidor: DatosPersonales.properties.id_usuario,
  cantidad: Type.Integer({ minimum: 1 }),
  precio: Producto.properties.precio,
  subtotal: Producto.properties.precio,
  username: Producto.properties.username,
  nombre: Producto.properties.nombre,
  descripcion: Producto.properties.descripcion,
  slug_producto: Producto.properties.slug_producto,
  fotos: Producto.properties.fotos,
  cantidad_disponible: Producto.properties.cantidad_disponible,
});

export type Consumidor = Static<typeof Consumidor>;
export type ItemCarrito = Static<typeof ItemCarrito>;
