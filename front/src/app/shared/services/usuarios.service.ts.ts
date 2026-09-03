import { Service } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { firstValueFrom } from 'rxjs';
import { Ubicacion } from '@shared/types/ubicacion';
import { Usuario } from '@shared/types/user.types';

@Service()
export class UsuariosService extends BaseService<Usuario> {
  protected override serviceUrl: string = `${environment.apiUrl}/usuarios`;

  public getUbicaciones(username: string) {
    const url = this.serviceUrl + '/' + username + '/ubicaciones';
    return firstValueFrom(this.http.get<Ubicacion[]>(url));
  }
}
