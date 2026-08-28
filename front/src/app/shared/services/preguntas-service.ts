import { Injectable, Service } from '@angular/core';
import { BaseService } from './base-service.service';
import { environment } from '@env/environment';
import { Pregunta } from '@shared/types/preguntas';
import { firstValueFrom } from 'rxjs';

@Service()
export class PreguntasService extends BaseService<Pregunta> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores/:productor/productos/:producto/preguntas`;

  public getById(productor: string, producto: string): Promise<Pregunta[]> {
    const url = `${this.buildUrl({ productor, producto })}`;
    return firstValueFrom(this.http.get<Pregunta[]>(url));
  }
}
