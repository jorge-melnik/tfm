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
};

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
};

export interface Productor {
  id_productor: string;
  nombres: string;
  apellidos: string;
  email: string;
  username: string;
  celular: string;
  foto_url?: string;
  presentacion: string;
}
