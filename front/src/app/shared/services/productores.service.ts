import { Service } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { Productor } from '@shared/types/user.types';
import { PresignedUrl, RequestPresignedUrl } from '@shared/types/producto';
import { firstValueFrom } from 'rxjs';

@Service()
export class ProductoresService extends BaseService<Productor> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores`;

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
