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
  protected override serviceUrl: string = `${environment.apiUrl}/categorias/:slug_categoria/subcategorias`;

  async getEtiquetas(slug_categoria: string, claveSubcategoria: number | string) {
    const url = `${this.buildUrl({ slug_categoria })}/${claveSubcategoria}/etiquetas`;
    return await firstValueFrom(this.http.get<Etiqueta[]>(url));
  }
}
