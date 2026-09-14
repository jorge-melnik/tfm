import { Ubicacion } from './ubicacion';

export type Rol = 'PRODUCTOR' | 'CONSUMIDOR' | 'ADMIN';
export type TipoLogin = 'email' | 'username';

export type Profile = {
  id_usuario: string;
  username: string;
  foto_url: string;
  roles: Rol[];
  rol_actual: Rol;
};

export type AdicionalesProductor = {
  presentacion: string;
  id_ubicacion?: number | null | undefined;
};
export type AdicionalesConsumidor = {};

export type RegistroType = {
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  celular: string;
  foto_url?: string;
  password: string;
  password2: string;
  roles: Rol[];
  productor?: AdicionalesProductor;
  consumidor?: AdicionalesConsumidor;
};

export interface Productor {
  id_productor: string;
  id_ubicacion: number;
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  celular: string;
  foto_url?: string;
  presentacion: string;
  ubicacion?: Ubicacion;
}
export interface Consumidor {
  id_consumidor: string;
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  celular: string;
  foto_url?: string;
}

export interface Usuario {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  celular: string;
  foto_url: string;
  roles: Rol[];
  rol_actual: Rol;
}
