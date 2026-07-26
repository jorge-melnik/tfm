export type Categoria = {
  id_categoria: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  activo: boolean;
};

export type Subcategoria = {
  id_categoria: number;
  id_subcategoria: number;
  nombre: string;
  subcategoria: string;
  categoria: string;
  activo: boolean;
  id_etiquetas: number[];
};
