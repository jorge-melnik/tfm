import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import {
  ImagenProducto,
  ImagenProductoFile,
  PresignedUrl,
  Producto,
  RequestPresignedUrl,
} from '@shared/types/producto';
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

  public async setImagenes(
    productor: string,
    producto: string,
    archivosNuevos: ImagenProductoFile[],
  ): Promise<void> {
    let imagenesSubidas: ImagenProducto[] = [];

    // 1. Si hay imágenes NUEVAS, pedimos URLs y las subimos a S3
    if (archivosNuevos.length > 0) {
      const payload: RequestPresignedUrl[] = archivosNuevos.map((a) => ({
        posicion: a.posicion,
        contentType: a.file.type,
      }));

      const urls = await firstValueFrom(
        this.http.post<PresignedUrl[]>(
          `${environment.apiUrl}/productores/${productor}/productos/${producto}/imagenes/presigned-urls`,
          payload,
        ),
      );

      const promesasSubirS3 = urls.map((item) => {
        const archivo = archivosNuevos.find((a) => a.posicion === item.posicion)!;

        return firstValueFrom(
          this.http.put(item.presignedUrl, archivo.file, {
            headers: { 'Content-Type': item.contentType },
          }),
        );
      });

      await Promise.all(promesasSubirS3);

      imagenesSubidas = urls.map((item) => ({
        posicion: item.posicion,
        path: item.path,
      }));
    }

    const payloadFinalBD = imagenesSubidas.sort((a, b) => a.posicion - b.posicion);

    await firstValueFrom(
      this.http.put(
        `${environment.apiUrl}/productores/${productor}/productos/${producto}/imagenes`,
        payloadFinalBD,
      ),
    );
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
