import { Static, Type } from '@sinclair/typebox';

export const Categoria = Type.Object({
  id_categoria: Type.Number(),
  nombre: Type.String(),
  descripcion: Type.String(),
  activo: Type.Boolean(),
});

export const Subcategoria = Type.Object({
  id_categoria: Type.Number(),
  id_subcategoria: Type.Number(),
  nombre: Type.String(),
  activo: Type.Boolean(),
  //   categoria: Type.String(),
});

export const Etiqueta = Type.Object({
  id_etiqueta: Type.Number(),
  nombre: Type.String(),
});

export type Categoria = Static<typeof Categoria>;
export type Subcategoria = Static<typeof Subcategoria>;
export type Etiqueta = Static<typeof Etiqueta>;
