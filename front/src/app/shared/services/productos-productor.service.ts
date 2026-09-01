import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import {
  ImagenProducto,
  ImagenProductoFile,
  ImagenSlot,
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

  // public getById(productor: string, producto: string): Promise<Producto> {
  //   const url = `${this.buildUrl({ productor })}/${producto}`;
  //   return firstValueFrom(this.http.get<Producto>(url));
  // }

  public async desactivar(productor: string, producto: string) {
    const url = `${this.buildUrl({ productor })}/${producto}`;
    await firstValueFrom(this.http.patch<Producto>(url, { activo: false }));
  }

  public async activar(productor: string, producto: string) {
    const url = `${this.buildUrl({ productor })}/${producto}`;
    await firstValueFrom(this.http.patch<Producto>(url, { activo: true }));
  }

  private getSlotsAws(slots: ImagenSlot[]): { posicion: number; file: File }[] {
    return slots
      .filter((slot): slot is ImagenSlot & { file: File } => !slot.existente && !!slot.file)
      .map((slot) => ({
        posicion: slot.posicion,
        file: slot.file,
      }));
  }

  public async setImagenes(
    productor: string,
    producto: string,
    slots: ImagenSlot[],
  ): Promise<void> {
    const archivosNuevos = this.getSlotsAws(slots);
    let imagenesProducto: ImagenProducto[] = slots.filter((s) => s.existente || s.path == '');
    console.log({ archivosNuevos });
    //Obtenemos las signed urls para subir a S3 solo si hay imágenes nuevas.
    if (archivosNuevos.length > 0) {
      const payload: RequestPresignedUrl[] = archivosNuevos.map((a) => ({
        posicion: a.posicion,
        contentType: a.file.type,
        filename: a.file.name,
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

      const imagenesSubidas = urls.map((item) => ({
        posicion: item.posicion,
        path: item.path,
      }));
      console.log({ imagenesSubidas });
      imagenesProducto = [...imagenesProducto, ...imagenesSubidas];
    }

    const payloadFinalBD = imagenesProducto.sort((a, b) => a.posicion - b.posicion);
    console.log({ payloadFinalBD });
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
