// src/common/response.helper.ts
export class ApiResponse<T = null> {
  message: string;
  status: number;
  data: T | null;

  constructor(message: string, status: number, data: T | null = null) {
    this.message = message;
    this.status = status;
    this.data = data;
  }

  static success<T>(data: T, message = 'Berhasil'): ApiResponse<T> {
    return new ApiResponse(message, 200, data);
  }

  static created<T>(data: T, message = 'Berhasil dibuat'): ApiResponse<T> {
    return new ApiResponse(message, 201, data);
  }

  static deleted(message = 'Berhasil dihapus'): ApiResponse {
    return new ApiResponse(message, 200, null);
  }

  static updated<T>(data: T, message = 'Berhasil diupdate'): ApiResponse<T> {
    return new ApiResponse(message, 200, data);
  }
}
