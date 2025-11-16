export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message?: string | Record<string, any> | string[];
  error?: string | Record<string, any> | null;
  data?: T | null;
  meta?: any | null;
}
