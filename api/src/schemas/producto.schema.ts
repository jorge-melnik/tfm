import { Type, Static } from '@sinclair/typebox';
import { Productor } from './productores.schema.js';
import { Subcategoria } from './categoria.schema.js';
import { DatosPersonales } from './usuarios.schema.js';

export const POSTProducto = Type.Object({
  id_productor: Productor.properties.id_productor,
  id_subcategoria: Subcategoria.properties.id_subcategoria,
  nombre: Type.String(),
  slug_producto: Type.String(),
  descripcion: Type.String(),
  precio: Type.Number(),
  cantidad_disponible: Type.Number(),
  id_etiquetas: Type.Array(Type.Integer()),
});

export const Producto = Type.Intersect([
  POSTProducto,
  Type.Object({
    id_producto: Type.Integer(),
    fotos: Type.Array(Type.String()),
    video: Type.Optional(Type.String()),
    etiquetas: Type.Array(Type.String()), //slug etiquetas
    username: DatosPersonales.properties.username,
  }),
]);

export type Producto = Static<typeof Producto>;
