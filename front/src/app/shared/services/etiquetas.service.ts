import { Injectable } from '@angular/core';
import { BaseService } from './base-service.service';
import { environment } from '@env/environment';
import { Etiqueta } from '@shared/types/etiqueta';

@Injectable({
  providedIn: 'root',
})
export class EtiquetasService extends BaseService<Etiqueta> {
  protected override serviceUrl: string = `${environment.apiUrl}/etiquetas`;
}
