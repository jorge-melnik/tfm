import { Type, Static } from '@sinclair/typebox';
import { Productor } from './productores.schema.js';
import { Categoria, Subcategoria } from './categoria.schema.js';
import { Departamento, Localidad } from './departamento.schema.js';

export const ImagenProducto = Type.Object({
  posicion: Type.Number({ minimum: 1, maximum: 5 }),
  path: Type.String(),
});

export const POSTProducto = Type.Object({
  productor: Productor.properties.username,
  subcategoria: Subcategoria.properties.subcategoria,
  etiquetas: Type.Array(Type.String()),
  nombre: Type.String(),
  descripcion: Type.String(),
  precio: Type.String(),
  cantidad_disponible: Type.Number(),
});

export const Producto = Type.Object({
  ...POSTProducto.properties,
  id_producto: Type.Integer(),
  id_productor: Productor.properties.id_productor,
  etiquetas: Type.Array(Type.String()),
  activo: Type.Optional(Type.Boolean()),
  categoria: Categoria.properties.categoria,
  producto: Type.String(),
  fotos: Type.Array(ImagenProducto, { description: 'las de urls de fotos.', minItems: 1, maxItems: 5 }),
  video: Type.Optional(Type.String()),
  departamento: Departamento.properties.departamento,
  localidad: Localidad.properties.departamento,
});

export const RequestPresignedUrlSchema = Type.Object({
  posicion: Type.Number({ minimum: 1, maximum: 5 }),
  contentType: Type.String(), // Ej: 'image/jpeg', 'image/png', 'image/webp'
  filename: Type.String({ minLength: 1 }),
});

export const PresignedUrl = Type.Object({
  posicion: Type.Integer({ minimum: 1, maximum: 5 }),
  presignedUrl: Type.String(),
  path: Type.String(),
  contentType: Type.String(),
});

export type Producto = Static<typeof Producto>;
export type ImagenProducto = Static<typeof ImagenProducto>;
export type POSTProducto = Static<typeof POSTProducto>;
