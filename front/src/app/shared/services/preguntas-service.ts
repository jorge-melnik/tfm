import { Service } from '@angular/core';
import { BaseService } from './base-service.service';
import { environment } from '@env/environment';
import { EstadoPregunta, Pregunta } from '@shared/types/preguntas';
import { firstValueFrom } from 'rxjs';
import { DeAcaRequestOptions, PaginatedResponse, Pagination } from '@shared/types/api.types';
import { HttpParams } from '@angular/common/http';

@Service()
export class PreguntasService extends BaseService<Pregunta> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores/:productor/productos/:producto/preguntas`;

  // public getById(productor: string, producto: string): Promise<Pregunta[]> {
  //   const url = `${this.buildUrl({ productor, producto })}`;
  //   return firstValueFrom(this.http.get<Pregunta[]>(url));
  // }

  public async responderPregunta(
    productor: string,
    producto: string,
    id_pregunta: number,
    contenido: string,
  ) {
    const url = `${this.buildUrl({ productor, producto })}/${id_pregunta}/respuestas`;
    return firstValueFrom(this.http.post<Pregunta[]>(url, { contenido }));
  }

  async getPreguntasPendientesProductor(
    productor: string,
    pagination: Pagination,
  ): Promise<PaginatedResponse<Pregunta>> {
    let params = new HttpParams();
    if (pagination) {
      if (!pagination) throw new Error('Tienes que especificar la paginación.');
      if (!pagination.page) throw new Error('Tienes que especificar page.');
      if (!pagination.limit) throw new Error('Tienes que especificar limit.');
      const { page, limit, sort, sort_direction } = pagination;

      params = params.set('page', page);
      params = params.set('limit', limit);
      if (sort) {
        params = params.set('sort', sort);
      }
      if (sort_direction) {
        params = params.set('sort_direction', sort_direction);
      }
    }

    const estado_pregunta: EstadoPregunta = 'PENDIENTE';
    params = params.set('estado_pregunta', estado_pregunta);
    console.log({ params: params.toString() });
    const url = `${environment.apiUrl}/productores/${productor}/preguntas`;
    return await firstValueFrom(this.http.get<PaginatedResponse<Pregunta>>(url, { params }));
  }
}
