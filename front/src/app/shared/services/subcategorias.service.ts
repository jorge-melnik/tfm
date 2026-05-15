import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { Subcategoria } from '@shared/types/categoria';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriasService extends BaseService<Subcategoria> {
  protected override serviceUrl: string = `${environment.apiUrl}/admin/categorias/:id_categoria/subcategorias`;

  async setEtiquetas(id_categoria: number, id_subcategoria: number, id_etiquetas: number[]) {
    const url = `${this.buildUrl({ id_categoria })}/${id_subcategoria}/etiquetas`;
    await firstValueFrom(this.http.patch(url, { id_categoria, id_subcategoria, id_etiquetas }));
  }
}
