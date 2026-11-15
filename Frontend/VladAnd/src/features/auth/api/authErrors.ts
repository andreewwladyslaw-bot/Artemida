import { ApiError } from '@/shared/api/apiClient';

/** Auth-specific human-readable errors belong to the auth feature, not shared/. */
export function toAuthError(error: unknown): ApiError {
  if (!(error instanceof ApiError)) {
    return new ApiError('An unexpected authentication error occurred.');
  }
  const messages: Record<number, string> = {
    0: 'Cannot connect to the server.',
    401: 'Invalid credentials or your session has expired.',
    403: 'Access denied.',
    429: 'Too many attempts. Please try again later.',
  };
  if (error.status === 400 || error.status === 422) {
    return new ApiError(
      error.message.startsWith('HTTP ') ? 'Please check the entered information.' : error.message,
      error.status,
    );
  }
  if (error.status >= 500) {
    return new ApiError('Server error. Please try again later.', error.status);
  }
  return new ApiError(messages[error.status] ?? error.message, error.status);
}
