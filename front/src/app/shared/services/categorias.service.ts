import { Injectable } from '@angular/core';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { firstValueFrom } from 'rxjs';
import { Etiqueta } from '@shared/types/etiqueta';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService extends BaseService<Categoria> {
  protected override serviceUrl: string = `${environment.apiUrl}/categorias`;

  async getSubcategorias (categoria: string){
    const url = `${this.serviceUrl}/${categoria}/subcategorias`;
    return firstValueFrom(this.http.get<Subcategoria[]>(url));
  }

  async getEtiquetas(categoria: string) {
    const url = `${this.serviceUrl}/${categoria}/etiquetas`;
    return await firstValueFrom(this.http.get<Etiqueta[]>(url));
  }
}
