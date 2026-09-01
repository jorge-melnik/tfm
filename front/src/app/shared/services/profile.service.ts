import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@env/environment';
import { Rol } from '@shared/types/user.types';
import { firstValueFrom } from 'rxjs';
import { PresignedUrl, RequestPresignedUrl } from '@shared/types/producto';

@Service()
export class ProfileService {
  private readonly _http = inject(HttpClient);
  //TODO: Armar base url en base al usuario logueado y su rol actual.

  public async setFotoPerfil(username: string, rol_actual: Rol, foto: File): Promise<void> {
    const baseUrl = `${environment.apiUrl}/${rol_actual.toLowerCase()}es/${username}/foto`;
    //Obtenemos las signed urls para subir a S3
    const payload: RequestPresignedUrl = {
      posicion: 1,
      contentType: foto.type,
      filename: foto.name,
    };
    const presignedUrl = await firstValueFrom(
      this._http.post<PresignedUrl>(`${baseUrl}/presigned-urls`, payload),
    );

    await firstValueFrom(
      this._http.put(presignedUrl.presignedUrl, foto, {
        headers: { 'Content-Type': presignedUrl.contentType },
      }),
    );

    await firstValueFrom(
      this._http.put(`${baseUrl}`, {
        foto_url: presignedUrl.path,
      }),
    );
  }
}
