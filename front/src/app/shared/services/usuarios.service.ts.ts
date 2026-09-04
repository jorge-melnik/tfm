import { Service } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { firstValueFrom } from 'rxjs';
import { Ubicacion, UbicacionIdeUy, UbicacionPost } from '@shared/types/ubicacion';
import { Usuario } from '@shared/types/user.types';

@Service()
export class UsuariosService extends BaseService<Usuario> {
  protected override serviceUrl: string = `${environment.apiUrl}/usuarios`;

  public getUbicaciones(username: string) {
    const url = this.serviceUrl + '/' + username + '/ubicaciones';
    return firstValueFrom(this.http.get<Ubicacion[]>(url));
  }

  public async addUbicacion(username: string, ubicacion: UbicacionPost) {
    const url = this.serviceUrl + '/' + username + '/ubicaciones';
    await firstValueFrom(this.http.post(url, ubicacion));
  }

  public async removeUbicacion(username: string, ubicacion: string) {
    const url = this.serviceUrl + '/' + username + '/ubicaciones/' + ubicacion;
    await firstValueFrom(this.http.delete(url));
  }

  public async updateUbicacion(username: string, ubicacion: string, data: Ubicacion) {
    const url = this.serviceUrl + '/' + username + '/ubicaciones/' + ubicacion;
    await firstValueFrom(this.http.put(url, data));
  }
}
