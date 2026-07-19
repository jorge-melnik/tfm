import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import { Producto } from '@shared/types/producto';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductosService extends BaseService<Producto> {
  protected override serviceUrl: string = `${environment.apiUrl}/productos`;
}
