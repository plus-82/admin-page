export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthData {
  accessToken: string;
  accessTokenExpireTime: number;
}

export interface ApiResponse<T> {
  data: T;
  code: string;
  message: string;
}

export type LoginResponse = ApiResponse<AuthData>;