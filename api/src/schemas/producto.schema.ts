import { Type, Static } from '@sinclair/typebox';
import { Productor } from './productores.schema.js';
import { Categoria, Subcategoria } from './categoria.schema.js';
import { DatosPersonales } from './usuarios.schema.js';

export const POSTProducto = Type.Object({
  id_productor: Productor.properties.id_productor,
  id_subcategoria: Subcategoria.properties.id_subcategoria,
  nombre: Type.String(),
  producto: Type.String(),
  descripcion: Type.String(),
  precio: Type.Number(),
  cantidad_disponible: Type.Number(),
  fotos: Type.Array(Type.String(), { description: 'las de urls de fotos.', minItems: 1, maxItems: 5 }),
  id_etiquetas: Type.Array(Type.Integer()),
});

export const Producto = Type.Object({
  ...POSTProducto.properties,
  id_categoria: Categoria.properties.id_categoria,
  id_producto: Type.Integer(),
  fotos: Type.Array(Type.String()),
  video: Type.Optional(Type.String()),
  etiquetas: Type.Array(Type.String()), //slug etiquetas
  username: DatosPersonales.properties.username,
  activo: Type.Optional(Type.Boolean()),
  categoria: Categoria.properties.nombre,
  subcategoria: Subcategoria.properties.nombre,
});

export type Producto = Static<typeof Producto>;
