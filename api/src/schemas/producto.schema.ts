import { Type, Static } from '@sinclair/typebox';
import { Productor } from './productores.schema.js';
import { Subcategoria } from './categoria.schema.js';

export const Producto = Type.Object({
  id_productor: Productor.properties.id_usuario,
  id_producto: Type.Integer(),
  id_subcategoria: Subcategoria.properties.id_subcategoria,
  nombre: Type.String(),
  slug_producto: Type.String(),

  descripcion: Type.String(),
  precio: Type.Number(),
  cantidad_disponible: Type.Number(),
  fotos: Type.Array(Type.String()),
  video: Type.Optional(Type.String()),
  etiquetas: Type.Array(Type.String()), //slug etiquetas
});

export type Producto = Static<typeof Producto>;
