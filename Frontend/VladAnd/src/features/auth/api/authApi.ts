import { apiRequest } from '@/shared/api/apiClient';
import { toAuthError } from './authErrors';
import type {
  AuthResponse, ChangeInitialPasswordRequest, ChangePasswordResponse, LoginCredentials,
} from '../types/auth.types';

async function requestAuth<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    return await apiRequest<T>(path, options);
  } catch (error) {
    throw toAuthError(error);
  }
}

export function getCurrentUser(): Promise<AuthResponse> {
  return requestAuth<AuthResponse>('/auth/me');
}

export function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
  return requestAuth<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function changeInitialPassword(
  credentials: ChangeInitialPasswordRequest,
): Promise<ChangePasswordResponse> {
  return requestAuth<ChangePasswordResponse>('/auth/change-initial-password', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
