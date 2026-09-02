import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { environment } from '@env/environment';
import {
  AdicionalesConsumidor,
  AdicionalesProductor,
  Profile,
  RegistroType,
  Rol,
  TipoLogin,
} from '@shared/types/user.types';
import { firstValueFrom } from 'rxjs';
import { UserStore } from './stores/user.store';
import { Router } from '@angular/router';

type TokenResponse = {
  token: string;
};

@Service()
export class AuthService {
  private serviceUrl: string = `${environment.apiUrl}/auth`;
  private readonly _http = inject(HttpClient);
  private readonly _userStore = inject(UserStore);
  private readonly _router = inject(Router);

  async doEmailLogin(email: string, password: string) {
    const urlLogin = `${this.serviceUrl}/login/email`;
    const resToken = await firstValueFrom(
      this._http.post<TokenResponse>(urlLogin, { email, password }),
    );
    this._userStore.setToken(resToken.token);
    await this.getProfile();
  }

  async doUsernameLogin(username: string, password: string) {
    const urlLogin = `${this.serviceUrl}/login/username`;
    const resToken = await firstValueFrom(
      this._http.post<TokenResponse>(urlLogin, { username, password }),
    );
    this._userStore.setToken(resToken.token);
    await this.getProfile();
  }

  async register(datos: RegistroType): Promise<Profile> {
    const url = `${this.serviceUrl}/register`;
    const resToken = await firstValueFrom(this._http.post<TokenResponse>(url, datos));
    this._userStore.setToken(resToken.token);
    await this.getProfile();
    const user = this._userStore.user();
    if (!user) throw new Error('No se pudo obtener el perfil del usuario después del registro.');
    return user;
  }

  public async getProfile() {
    const urlProfile = `${this.serviceUrl}/user`;
    const profile = await firstValueFrom(this._http.get<Profile>(urlProfile));
    this._userStore.setUser(profile);
  }

  public async refreshToken() {
    console.log('Refreshing token...');
    const refreshUrl = `${this.serviceUrl}/refresh`;
    const resToken = await firstValueFrom(
      this._http.get<TokenResponse>(refreshUrl, { withCredentials: true }), //Se envía la cookie refreshToken
    );
    this._userStore.setToken(resToken.token);
    await this.getProfile();
  }

  public async goToUserHome() {
    const user = this._userStore.user();
    if (!user) return;
    this._router.navigate(['/', user.rol_actual.toLowerCase()]);
  }

  async doLogout() {
    const logoutUrl = `${this.serviceUrl}/logout`;
    await firstValueFrom(this._http.get(logoutUrl)); //Esto debería borrar el refresh token.
    this._userStore.setToken(null);
    this._userStore.setUser(null);
    this._router.navigate(['/']);
  }

  async activarProductor(datos: AdicionalesProductor) {
    const url = `${this.serviceUrl}/user/productor`;
    const profile = await firstValueFrom(this._http.post<Profile>(url, datos));
    this._userStore.setUser(profile);
    await this.refreshToken();
  }
  async activarConsumidor(datos: AdicionalesConsumidor) {
    const url = `${this.serviceUrl}/user/consumidor`;
    const profile = await firstValueFrom(this._http.post<Profile>(url, datos));
    this._userStore.setUser(profile);
    await this.refreshToken();
    await this.cambiarRolActualA('CONSUMIDOR'); //FIXME: Mejor hacerlo en la propia ruta antes de cargar el componente como el redirect con productor?
  }

  async cambiarRolActualA(rol: Rol) {
    const url = `${this.serviceUrl}/user/${rol.toLowerCase()}`;
    await firstValueFrom(this._http.put(url, { rol }));
    await this.refreshToken(); //Recargamos el usuario y token para que tenga actualizado el rol actual.
  }

  public async cargarSesionAlArrancar(): Promise<void> {
    try {
      await this.refreshToken();
      // this.goToUserHome(); TODO: Si hago esto pierdo los queryParams. Borrar línea?
    } catch (error) {
      return Promise.resolve();
    }
  }
}
