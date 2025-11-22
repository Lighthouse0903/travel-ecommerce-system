// Các lỗi theo field: booking_id, rating, comment, ...
export interface ApiFieldErrors {
  [field: string]: string[]; // VD: booking_id: ["Dữ liệu không hợp lệ."]
}

// Lỗi chuẩn từ backend
export interface ApiError {
  message?: string;
  errors?: ApiFieldErrors;
}

// Response tổng
export type ApiResponse<T> =
  | {
      success: true;
      status: number;
      message?: string | Record<string, any> | string[];
      data: T;
      error?: null;
      meta?: any | null;
    }
  | {
      success: false;
      status: number;
      message?: string | Record<string, any> | string[];
      data?: null;
      error: ApiError;
      meta?: any | null;
    };
