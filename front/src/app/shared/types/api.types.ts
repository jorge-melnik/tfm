export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    last_page: number;
  };
}

export type Primitive = string | number | boolean;
export type ApiQueryParams = Record<string, Primitive | Primitive[]>;
export type PathParams = Record<string, number | string>;
export interface Pagination {
  page?: number;
  limit?: number;
  sort?: string;
  sort_direction?: 'ASC' | 'DESC';
}

export interface DeAcaRequestOptions {
  pathParams?: PathParams;
  queryParams?: ApiQueryParams;
  pagination?: Pagination;
}
