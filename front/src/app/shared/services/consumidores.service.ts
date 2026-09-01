import { Injectable, Service } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { Consumidor, Profile, Rol } from '@shared/types/user.types';
import { PresignedUrl, RequestPresignedUrl } from '@shared/types/producto';
import { firstValueFrom } from 'rxjs';

@Service()
export class ConsumidoresService extends BaseService<Consumidor> {
  protected override serviceUrl: string = `${environment.apiUrl}/consumidores`;

  public async setFotoPerfil(username: string, foto: File | null): Promise<void> {
    const baseUrl = `${this.serviceUrl}/${username}/foto`;
    if (!foto) {
      await firstValueFrom(
        this.http.put(`${baseUrl}`, {
          foto_url: null,
        }),
      );
      return;
    }
    //Obtenemos las signed urls para subir a S3
    const payload: RequestPresignedUrl = {
      posicion: 1,
      contentType: foto.type,
      filename: foto.name,
    };
    const presignedUrl = await firstValueFrom(
      this.http.post<PresignedUrl>(`${baseUrl}/presigned-urls`, payload),
    );

    await firstValueFrom(
      this.http.put(presignedUrl.presignedUrl, foto, {
        headers: { 'Content-Type': presignedUrl.contentType },
      }),
    );

    await firstValueFrom(
      this.http.put(`${baseUrl}`, {
        foto_url: presignedUrl.path,
      }),
    );
  }
}
