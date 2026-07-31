import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import { Producto } from '@shared/types/producto';
import { environment } from '@env/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosProductorService extends BaseService<Producto> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores/:productor/productos`;

  public getById(productor: string, producto: string): Promise<Producto> {
    const url = `${this.buildUrl({ productor })}/${producto}`;
    return firstValueFrom(this.http.get<Producto>(url));
  }
}
