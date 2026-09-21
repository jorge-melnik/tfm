// @shared/types/ubicacion.types.ts
export interface Departamento {
  id_departamento: number;
  nombre: string;
  departamento: string;
}
export interface Localidad {
  id_localidad: number;
  id_departamento: number;
  nombre: string;
  codigo_postal?: string;
  departamento: string;
}

export type Ubicacion = {
  id_usuario: string;
  id_ubicacion: number | null;
  id_departamento: number;
  id_localidad: number;
  localidad: string;
  departamento: string;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  ubicacion: string;
  comentarios: string;
};

// Payload para crear una nueva ubicación (sin campos generados por la BD)
export type UbicacionPost = Omit<Ubicacion, 'id_ubicacion' | 'localidad' | 'id_usuario'>;

export const ubicacionVacia: Ubicacion = {
  id_usuario: '',
  id_ubicacion: null,
  id_localidad: 0,
  id_departamento: 0,
  localidad: '',
  departamento: '',
  nombre: '',
  latitud: 0,
  longitud: 0,
  direccion: '',
  comentarios: '',
  ubicacion: '',
};

export type TipoUbicacionIdeUy = 'POI' | 'CALLEyPORTAL' | string;

export interface UbicacionIdeUy {
  type: TipoUbicacionIdeUy;
  id: string;
  address: string;
  idCalle: number;
  nomVia: string;
  postalCode: string;
  idLocalidad: number;
  localidad: string;
  idDepartamento: number;
  departamento: string;
  manzana: string | null;
  solar: string | null;
  inmueble: string | null;
  idCalleEsq: number;
  km: number;
  priority: number;
  geom: string | null;
  tip_via: string | null;
  lat: number;
  lng: number;
  portalNumber: number;
  letra: string | null;
  stateMsg: string;
  source: string;
  ranking: number;
  state: number;
}

export interface Coordenadas {
  latitud: number;
  longitud: number;
}
