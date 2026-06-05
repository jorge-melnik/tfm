import { Type } from '@angular/core';

export type rol = 'PRODUCTOR' | 'CONSUMIDOR' | 'ADMIN';
export type TipoLogin = 'email' | 'username';

export type Profile = {
  id_usuario: string;
  username: string;
  foto_url: string;
  roles: rol[];
  rol_actual: rol;
};
