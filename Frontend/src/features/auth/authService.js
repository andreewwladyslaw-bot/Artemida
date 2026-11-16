
import { apiRequest } from '../../shared/api/client';

export function signIn(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  });
}
