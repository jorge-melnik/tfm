import { PathParams } from '@shared/types/api.types';

export interface CrudServiceInterface<T> {
  getAll(pathParams?: PathParams): Promise<T[]>;
  create(data: Partial<T>, pathParams?: PathParams): Promise<T>;
  update(id: number | string, data: Partial<T>, pathParams?: PathParams): Promise<void>;
  remove(id: number | string, pathParams?: PathParams): Promise<void>;
}

export abstract class CrudPage<T> {
  protected abstract getAll(): Promise<T[]>;
  protected abstract create(data: Partial<T>): Promise<T | null>;
  protected abstract update(data: Partial<T>): Promise<void>;
  protected abstract remove(data: T): Promise<void>;
}
