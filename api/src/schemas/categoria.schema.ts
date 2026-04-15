import { Static, Type } from '@sinclair/typebox';

export const Categoria = Type.Object(
  {
    id_categoria: Type.Number({
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
    id_categoria: Type.Number({
      description: 'Identificador de la categoría a la que pertenece',
    }),
    id_subcategoria: Type.Number({
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
    id_etiqueta: Type.Number({
      description: 'Identificador único de la etiqueta',
    }),
    nombre: Type.String({
      description: 'Nombre de la etiqueta',
    }),
  },
  {
    description: 'Etiqueta utilizada para clasificar o marcar elementos',
  },
);

export type Categoria = Static<typeof Categoria>;
export type Subcategoria = Static<typeof Subcategoria>;
export type Etiqueta = Static<typeof Etiqueta>;
