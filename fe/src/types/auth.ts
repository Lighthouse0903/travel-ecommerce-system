import { UserResponse } from "./user";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
}

export interface RegisterResponse extends UserResponse {}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  user: UserResponse;
}

export interface AuthContextType {
  access: string | null;
  user: any | null;
  setAccess: (token: string | null) => void;
  setUser: (user: UserResponse | null | any) => void;
  logout: () => void;
  loading: boolean;
}

export interface ResetPassword {
  current_password: string;
  new_password: string;
}
