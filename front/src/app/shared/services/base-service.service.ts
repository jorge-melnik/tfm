import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { DeAcaRequestOptions, PaginatedResponse, PathParams } from '@shared/types/api.types';
import { CrudServiceInterface } from '@shared/types/crud-base';
import { firstValueFrom } from 'rxjs';

export abstract class BaseService<T> implements CrudServiceInterface<T> {
  protected http = inject(HttpClient);
  protected abstract serviceUrl: string;

  protected buildUrl(pathParams?: PathParams): string {
    let url = this.serviceUrl;
    if (pathParams) {
      Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value.toString());
      });
    }
    return url;
  }

  async getAll(pathParams?: PathParams): Promise<T[]> {
    console.log({ pathParams });
    return await firstValueFrom(this.http.get<T[]>(this.buildUrl(pathParams)));
  }

  async getBy(options?: DeAcaRequestOptions): Promise<PaginatedResponse<T>> {
    let params = new HttpParams();
    if (options?.pagination) {
      if (!options?.pagination) throw new Error('Tienes que especificar la paginación.');
      if (!options?.pagination.page || !options?.pagination.limit)
        throw new Error('Tienes que especificar page y limit.');
      const { page, limit, orderBy, orderDirection } = options?.pagination;
      console.log(options?.pagination);
      params = params.set('page', page);
      params = params.set('limit', limit);
      console.log({ params });
      if (orderBy) {
        params = params.set('orderBy', orderBy);
      }
      if (orderDirection) {
        params = params.set('orderDirection', orderDirection);
      }
    }
    if (options?.queryParams) {
      Object.entries(options.queryParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            params = params.append(key, v); //append para que repita la clave.
          });
        } else {
          params = params.set(key, value);
        }
      });
    }

    return await firstValueFrom(
      this.http.get<PaginatedResponse<T>>(this.buildUrl(options?.pathParams), { params }),
    );
  }

  async create(data: Partial<T>, pathParams?: PathParams): Promise<T> {
    return await firstValueFrom(this.http.post<T>(this.buildUrl(pathParams), data));
  }

  async update(id: number | string, data: Partial<T>, pathParams?: PathParams): Promise<void> {
    await firstValueFrom(this.http.put<T>(`${this.buildUrl(pathParams)}/${id}`, data));
  }

  async remove(id: number | string, pathParams?: PathParams): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.buildUrl(pathParams)}/${id}`));
  }
}
