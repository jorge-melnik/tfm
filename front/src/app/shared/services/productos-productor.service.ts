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

  public async desactivar(productor: string, producto: string) {
    const url = `${this.buildUrl({ productor })}/${producto}`;
    await firstValueFrom(this.http.patch<Producto>(url, { activo: false }));
  }

  public async activar(productor: string, producto: string) {
    const url = `${this.buildUrl({ productor })}/${producto}`;
    await firstValueFrom(this.http.patch<Producto>(url, { activo: true }));
  }

  public getProductoVacio(): Producto {
    return {
      id_productor: '',
      id_subcategoria: 0,
      id_producto: 0,
      categoria: '',
      subcategoria: '',
      nombre: '',
      productor: '',
      producto: '',
      descripcion: '',
      precio: 0,
      cantidad_disponible: 0,
      etiquetas: [],
      fotos: [],
      id_etiquetas: [],
      activo: true,
    };
  }
}
