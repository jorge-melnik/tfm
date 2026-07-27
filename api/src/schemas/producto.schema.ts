import { Type, Static } from '@sinclair/typebox';
import { Productor } from './productores.schema.js';
import { Categoria, Subcategoria } from './categoria.schema.js';

export const POSTProducto = Type.Object({
  productor: Productor.properties.username,
  subcategoria: Subcategoria.properties.subcategoria,
  etiquetas: Type.Array(Type.String()),
  nombre: Type.String(),
  descripcion: Type.String(),
  precio: Type.Number(),
  cantidad_disponible: Type.Number(),
});

export const Producto = Type.Object({
  ...POSTProducto.properties,
  id_producto: Type.Integer(),
  etiquetas: Type.Array(Type.String()),
  activo: Type.Optional(Type.Boolean()),
  categoria: Categoria.properties.categoria,
  producto: Type.String(),
  fotos: Type.Array(Type.String(), { description: 'las de urls de fotos.', minItems: 1, maxItems: 5 }),
  video: Type.Optional(Type.String()),
});

export type Producto = Static<typeof Producto>;
export type POSTProducto = Static<typeof POSTProducto>;
