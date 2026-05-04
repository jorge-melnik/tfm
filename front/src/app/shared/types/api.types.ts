export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  lastPage: number;
}

export type Primitive = string | number | boolean;
export type QueryFilters = Record<string, Primitive | Primitive[]>;
