export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message?: string | Record<string, any> | null;
  error?: string | Record<string, any> | null;
  data?: T | null;
  meta: any | null;
}
