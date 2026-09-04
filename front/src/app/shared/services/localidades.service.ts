import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { Localidad, Ubicacion, UbicacionIdeUy, ubicacionVacia } from '@shared/types/ubicacion';
import { firstValueFrom } from 'rxjs';
import { UserStore } from './stores/user.store';

@Service()
export class LocalidadsService extends BaseService<Localidad> {
  protected override serviceUrl: string = `${environment.apiUrl}/departamentos/:departamento/localidades`;

  public async getNuevaUbicacionFromCoordenada(
    latitud: number,
    longitud: number,
  ): Promise<Ubicacion> {
    const ideUyUrl = `https://direcciones.ide.uy/api/v0/geocode/reverse?latitud=${latitud}&limit=1&longitud=${longitud}`;
    const direcciones = await firstValueFrom(this.http.get<UbicacionIdeUy[]>(ideUyUrl));
    const direccion = direcciones.find((d) => d.type.toLowerCase() == 'CALLEyPORTAL'.toLowerCase());
    console.log({ direccion });
    if (!direccion) return ubicacionVacia;
    const localidad = await this.getById(direccion.localidad, {
      departamento: direccion.departamento,
      localidad: direccion.localidad,
    });
    console.log({ localidad });
    const ubicacion = {
      ...ubicacionVacia,
      ...localidad,
      direccion: direccion.address,
      // codigo_postal: direccion.postalCode,
    };
    return ubicacion;
  }
}
