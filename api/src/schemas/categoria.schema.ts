import { Static, Type } from '@sinclair/typebox';

export const Categoria = Type.Object(
  {
    id_categoria: Type.Integer({
      description: 'Identificador único de la categoría',
    }),
    nombre: Type.String({
      description: 'Nombre de la categoría',
    }),
    descripcion: Type.String({
      description: 'Descripción detallada de la categoría',
    }),
    activo: Type.Boolean({
      description: 'Indica si la categoría está activa',
    }),
  },
  {
    description: 'Categoría principal utilizada para clasificar elementos',
  },
);

export const Subcategoria = Type.Object(
  {
    id_categoria: Type.Integer({
      description: 'Identificador de la categoría a la que pertenece',
    }),
    id_subcategoria: Type.Integer({
      description: 'Identificador único de la subcategoría',
    }),
    nombre: Type.String({
      description: 'Nombre de la subcategoría',
    }),
    activo: Type.Boolean({
      description: 'Indica si la subcategoría está activa',
    }),
    //   categoria: Type.String(),
  },
  {
    description: 'Subcategoría asociada a una categoría',
  },
);

export const Etiqueta = Type.Object(
  {
    id_etiqueta: Type.Integer({
      description: 'Identificador único de la etiqueta',
    }),
    nombre: Type.String({
      description: 'Nombre de la etiqueta',
    }),
  },
  {
    description: 'Etiqueta utilizada para clasificar o marcar elementos',
    examples: [{ id_etiqueta: 1, nombre: 'etiqueta 1' }],
  },
);

// export const CategoriasResponse = Type.Object(DeAcaListResponse(Categoria).properties, {
//   examples: [
//     {
//       data: [
//         { id_categoria: 1, nombre: 'categoria 1', descripcion: 'Descripcion de categoria 1.', activo: true },
//         { id_categoria: 2, nombre: 'categoria 2', descripcion: 'Descripcion de categoria 2.', activo: true },
//       ],
//     },
//   ],
// });

// export const SubcategoriasResponse = Type.Object(DeAcaListResponse(Subcategoria).properties, {
//   examples: [
//     {
//       data: [
//         { id_categoria: 1, id_subcategoria: 1, nombre: 'subcategoria 2', activo: true },
//         { id_categoria: 1, id_subcategoria: 2, nombre: 'subcategoria 2', activo: true },
//       ],
//     },
//   ],
// });

export type Categoria = Static<typeof Categoria>;
export type Subcategoria = Static<typeof Subcategoria>;
export type Etiqueta = Static<typeof Etiqueta>;
