
import { ApiError } from '../../shared/api/client';

export function getLoginErrorMessage(error) {
  if (!(error instanceof ApiError)) {
    return 'Unable to sign in. Please try again.';
  }

  if ([400, 401, 403].includes(error.status)) {
    return 'Invalid login or password.';
  }

  if (error.status === 429) {
    return 'Too many login attempts. Please try again later.';
  }

  if (error.status >= 500) {
    return 'Server is temporarily unavailable. Please try again later.';
  }

  if (error.status === 0) {
    return 'Cannot connect to the server. Check your connection.';
  }

  return 'Unable to sign in. Please try again.';
}
