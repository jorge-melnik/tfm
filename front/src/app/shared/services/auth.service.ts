import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { Profile, TipoLogin } from '@shared/types/user.types';
import { firstValueFrom } from 'rxjs';
import { UserStore } from './stores/user.store';
import { Router } from '@angular/router';

type TokenResponse = {
  token: string;
};

@Injectable({
  providedIn: 'root',
})
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

  private async getProfile() {
    const urlProfile = `${this.serviceUrl}/user`;
    const profile = await firstValueFrom(this._http.get<Profile>(urlProfile));
    this._userStore.setUser(profile);
  }

  public async refreshToken() {
    const refreshUrl = `${this.serviceUrl}/refresh`;
    const resToken = await firstValueFrom(this._http.get<TokenResponse>(refreshUrl));
    this._userStore.setToken(resToken.token);
    await this.getProfile();
  }

  public async goToUserHome() {
    const user = this._userStore.user();
    if (!user) return;
    this._router.navigate(['/', user.rol_actual.toLowerCase()]);
  }

  async doLogout() {
    this._userStore.setToken(null);
    this._userStore.setUser(null);
  }
}
