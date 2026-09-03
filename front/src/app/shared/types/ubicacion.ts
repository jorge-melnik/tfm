// @shared/types/ubicacion.types.ts
export interface Departamento {
  id_departamento: number;
  nombre: string;
  departamento?: string;
}
export interface Localidad {
  id_localidad: number;
  nombre: string;
  codigo_postal?: string;
  departamento?: string;
}

export type Ubicacion = {
  id_usuario: string;
  id_ubicacion: string;
  id_localidad: number;
  localidad: string;
  departamento: string;
  nombre: string;
  direccion: string;
  latitud: string;
  longitud: string;
  comentarios: string;
};

// Payload para crear una nueva ubicación (sin campos generados por la BD)
export type UbicacionPost = Omit<Ubicacion, 'id_ubicacion' | 'localidad' | 'id_usuario'>;

export const ubicacionVacia = {
  id_usuario: '',
  id_ubicacion: '',
  id_localidad: 0,
  localidad: '',
  departamento: '',
  nombre: '',
  direccion: '',
  latitud: '',
  longitud: '',
  comentarios: '',
};
