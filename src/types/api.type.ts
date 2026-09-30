export interface IApiBaseResponse {
  success: boolean;
  message: string;
}

export interface IPaginationMetadata {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IResponse<T> extends IApiBaseResponse {
  data: T;
}

export interface IPaginatedResponse<T> extends IApiBaseResponse {
  data: T[];
  meta: IPaginationMetadata;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface IPagination {
  page: number;
  limit: number;
}
