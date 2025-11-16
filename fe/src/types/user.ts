export interface UserResponse {
  user_id?: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  created_at?: string;
  updated_at?: string;
  roles?: number[];
}

export type User = UserResponse;

export type UpdateProfile = Partial<{
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
}>;
