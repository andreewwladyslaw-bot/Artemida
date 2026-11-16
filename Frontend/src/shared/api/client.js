
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/$/, '');

export class ApiError extends Error {
  constructor(status, message = 'Request failed') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest(
  path,
  { method = 'GET', body } = {}
) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(body === undefined
        ? {}
        : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ApiError(0, 'Network request failed');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return data;
}
