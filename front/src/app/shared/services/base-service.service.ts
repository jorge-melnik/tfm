import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@env/environment';
import { PaginatedResponse, QueryFilters } from '@shared/types/api.types';
import { firstValueFrom } from 'rxjs';

export abstract class BaseService<T> {
  protected http = inject(HttpClient);
  protected abstract serviceUrl: string;

  async getAll(): Promise<T[]> {
    return await firstValueFrom(this.http.get<T[]>(this.serviceUrl));
  }

  async getById(id: number | string): Promise<T> {
    return await firstValueFrom(this.http.get<T>(`${this.serviceUrl}/${id}`));
  }

  async getBy(
    filtros: QueryFilters = {},
    page: number = 1,
    limit: number = 10,
    orderBy?: string,
    orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<PaginatedResponse<T>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (orderBy) {
      params = params.set('orderBy', orderBy);
      params = params.set('orderDirection', orderDirection);
    }

    Object.entries(filtros).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          params = params.append(key, v); //append para que repita la clave.
        });
      } else {
        params = params.set(key, value);
      }
    });

    return await firstValueFrom(this.http.get<PaginatedResponse<T>>(this.serviceUrl, { params }));
  }

  async create(data: Partial<T>): Promise<T> {
    return await firstValueFrom(this.http.post<T>(this.serviceUrl, data));
  }

  async update(id: number | string, data: Partial<T>): Promise<void> {
    await firstValueFrom(this.http.put<T>(`${this.serviceUrl}/${id}`, data));
  }

  async remove(id: number | string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.serviceUrl}/${id}`));
  }
}
