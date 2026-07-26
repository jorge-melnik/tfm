export interface Producto {
  id_productor: string;
  id_producto: number;
  id_categoria: number;
  id_subcategoria: number;
  nombre: string;
  slug_producto: string;
  descripcion: string;
  precio: number;
  cantidad_disponible: number;
  fotos: string[];
  video_url?: string | null;
  username: string;
  etiquetas: string[];
  id_etiquetas: number[];
}
