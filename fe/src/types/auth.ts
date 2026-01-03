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
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  user: UserResponse | null;
  setAccess: (token: string | null) => void;
  setUser: (user: UserResponse | null) => void;
  logout: () => void;
  loading: boolean;
  refreshAccessToken: () => Promise<string | null>;
  refetchProfile: () => Promise<void>;
}

export type ChangePassword = {
  current_password: string;
  new_password: string;
};

export type MessageResponse = {
  message: string;
};
