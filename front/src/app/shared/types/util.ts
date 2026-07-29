export interface TableColumn {
  key: string;
  keyTitle: string;
  type:
    | 'text'
    | 'number'
    | 'date'
    | 'boolean'
    | 'color'
    | 'icono'
    | 'link'
    | 'categoria'
    | 'subcategoria'
    | 'etiquetas';
}

export interface SortOption {
  label: string;
  value: string;
}
