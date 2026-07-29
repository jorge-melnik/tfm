export interface Producto {
  id_productor: string;
  id_producto: number;
  id_subcategoria: number;
  productor: string;
  producto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  cantidad_disponible: number;
  fotos: string[];
  video_url?: string | null;
  username?: string;
  id_etiquetas: number[];
  categoria: string;
  subcategoria: string;
  etiquetas: string[];
  activo: boolean;
}
