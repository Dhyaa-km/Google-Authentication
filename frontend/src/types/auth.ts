export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserResponse {
  user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

