export interface UserResponse {
  user_id: string;
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
