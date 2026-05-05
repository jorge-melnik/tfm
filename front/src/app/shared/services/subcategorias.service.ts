import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BaseService } from './base-service.service';
import { Subcategoria } from '@shared/types/categoria';

@Injectable({
  providedIn: 'root',
})
export class SubcategoriasService extends BaseService<Subcategoria> {
  protected override serviceUrl: string = `${environment.apiUrl}/admin/categorias/:id_categoria/subcategorias`;
}
