import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import { Categoria } from '@shared/types/categoria';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService extends BaseService<Categoria> {
  protected override serviceUrl: string = `${environment.apiUrl}/categorias`;
}
