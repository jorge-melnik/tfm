export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  lastPage: number;
}

export type Primitive = string | number | boolean;
export type QueryParams = Record<string, Primitive | Primitive[]>;
export type PathParams = Record<string, number | string>;
export interface Pagination {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
}

export interface DeAcaRequestOptions {
  pathParams?: PathParams;
  queryParams?: QueryParams;
  pagination?: Pagination;
}
