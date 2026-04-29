import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  lastPage: number;
}

export class BaseService<T> {
  protected http = inject(HttpClient);
  protected resourceUrl = '';

  async getAll(): Promise<T[]> {
    return await firstValueFrom(this.http.get<T[]>(this.resourceUrl));
  }

  async getById(id: number | string): Promise<T> {
    return await firstValueFrom(this.http.get<T>(`${this.resourceUrl}/${id}`));
  }

  async getBy(
    filtros: any = {},
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

    Object.keys(filtros).forEach((key) => {
      if (filtros[key] !== null && filtros[key] !== undefined && filtros[key] !== '') {
        params = params.set(key, filtros[key]);
      }
    });

    return await firstValueFrom(this.http.get<PaginatedResponse<T>>(this.resourceUrl, { params }));
  }

  async create(data: Partial<T>): Promise<T> {
    return await firstValueFrom(this.http.post<T>(this.resourceUrl, data));
  }

  async update(id: number | string, data: Partial<T>): Promise<void> {
    await firstValueFrom(this.http.put<T>(`${this.resourceUrl}/${id}`, data));
  }

  async remove(id: number | string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.resourceUrl}/${id}`));
  }
}
