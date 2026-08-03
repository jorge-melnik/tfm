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

// password2: Type.String(),
//       roles: UserSchema.properties.roles,
//       //Consumidor y productor debe coincidir con lo especificado en el rol
//       consumidor: Type.Optional(Type.Omit(AdicionalesConsumidor, ['id_consumidor'])),
//       productor: Type.Optional(Type.Omit(AdicionalesProductor, ['id_productor'])),
