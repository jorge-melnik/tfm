import { Injectable } from '@angular/core';
import { Categoria } from '@shared/types/categoria';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { firstValueFrom } from 'rxjs';
import { Etiqueta } from '@shared/types/etiqueta';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService extends BaseService<Categoria> {
  protected override serviceUrl: string = `${environment.apiUrl}/categorias`;

  async getEtiquetas(claveCategoria: number | string) {
    const url = `${this.serviceUrl}/${claveCategoria}/etiquetas`;
    return await firstValueFrom(this.http.get<Etiqueta[]>(url));
  }
}
