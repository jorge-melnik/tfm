export interface ImagenProductoFile {
  posicion: number;
  file: File;
}

export interface ImagenProducto {
  posicion: number;
  path: string;
}

export interface RequestPresignedUrl {
  posicion: number;
  contentType: string;
  filename: string;
}

export interface PresignedUrl {
  posicion: number;
  presignedUrl: string;
  path: string;
  contentType: string;
}

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
  fotos: ImagenProducto[];
  video_url?: string | null;
  username?: string;
  id_etiquetas: number[];
  categoria: string;
  subcategoria: string;
  etiquetas: string[];
  activo: boolean;
}

export interface ImagenSlot {
  posicion: number;
  path: string;
  existente: boolean;
  file?: File;
}
