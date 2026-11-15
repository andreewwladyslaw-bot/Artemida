export interface AuthUser {
  id: number | string;
  login?: string;
  role: string;
  mustChangePassword: boolean;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser | null;
}

export interface ChangeInitialPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
}
