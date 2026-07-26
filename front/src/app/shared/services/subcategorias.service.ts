import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Subcategoria } from '@shared/types/categoria';
import { firstValueFrom } from 'rxjs';
import { BaseService } from './base-service.service';
import { Etiqueta } from '@shared/types/etiqueta';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriasService extends BaseService<Subcategoria> {
  protected override serviceUrl: string = `${environment.apiUrl}/subcategorias`;

  async getEtiquetas(slug_subcategoria: string): Promise<Etiqueta[]> {
    const url = `${this.buildUrl()}/${slug_subcategoria}/etiquetas`;
    return await firstValueFrom(this.http.get<Etiqueta[]>(url));
  }

  async setEtiquetas(slug_subcategoria: string, id_etiquetas: number[]) {
    const url = `${this.buildUrl()}/${slug_subcategoria}/etiquetas`;
    await firstValueFrom(this.http.patch(url, { slug_subcategoria, id_etiquetas }));
  }
}
