import { Type } from '@angular/core';

export type Rol = 'PRODUCTOR' | 'CONSUMIDOR' | 'ADMIN';
export type TipoLogin = 'email' | 'username';

export type Profile = {
  id_usuario: string;
  username: string;
  foto_url: string;
  roles: Rol[];
  rol_actual: Rol;
};
