export class ApiError extends Error {
  constructor(message: string, public readonly status = 0) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiPayload = { message?: unknown } | null;

/** Generic HTTP transport: no authentication-specific messaging here. */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError('Network request failed.');
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const payload = data as ApiPayload;
    const message = typeof payload?.message === 'string'
      ? payload.message
      : `HTTP ${response.status}`;
    throw new ApiError(message, response.status);
  }
  return data as T;
}
