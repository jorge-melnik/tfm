import { Injectable, signal } from '@angular/core';
import { Profile, Rol } from '@shared/types/user.types';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private _user = signal<Profile | null>(null);
  public user = this._user.asReadonly();

  /**
   * Access token que se guarda solo en memoria.
   * El refresh token se va a setear en la cookie.
   */
  private _token = signal<string | null>(null);
  public token = this._token.asReadonly();

  public setUser(usuario: Profile | null) {
    this._user.set(usuario);
  }
  public setToken(token: string | null) {
    this._token.set(token);
  }

  public userHasRole(rol: Rol): boolean {
    return !!this._user()?.roles.includes(rol);
  }
}
