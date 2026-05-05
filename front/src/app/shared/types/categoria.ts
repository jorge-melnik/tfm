export type Categoria = {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  slug_categoria: string;
  activo: boolean;
};

export type Subcategoria = {
  id_categoria: number;
  id_subcategoria: number;
  nombre: string;
  slug_subcategoria: string;
  slug_categoria: string;
  activo: boolean;
};
