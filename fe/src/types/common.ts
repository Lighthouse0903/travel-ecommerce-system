export interface ApiFieldErrors {
  [field: string]: string[];
}

export interface ApiError {
  message?: string;
  errors?: ApiFieldErrors;
}

// Response thành công
export interface ApiSuccessResponse<T, M = null> {
  success: true;
  status: number;
  message?: string;
  data: T;
  error: null;
  meta?: M;
}
// Response thất bại
export interface ApiErrorResponse<M = null> {
  success: false;
  status: number;
  message?: string;
  data: null;
  error: ApiError;
  meta?: M;
}

export type ApiResponse<T, M = null> =
  | ApiSuccessResponse<T, M>
  | ApiErrorResponse<M>;
