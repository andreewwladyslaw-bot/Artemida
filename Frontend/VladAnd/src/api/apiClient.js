export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`/api${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Brak połączenia z serwerem.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = "Nie udało się wykonać żądania.";

    if (response.status === 400 ||
        response.status === 422) {
      message = data?.message || "Sprawdź wprowadzone dane.";
    } else if (response.status === 401) {
      message = "Nieprawidłowe dane logowania lub sesja wygasła.";
    } else if (response.status === 403) {
      message = "Brak dostępu.";
    } else if (response.status === 429) {
      message = "Zbyt wiele prób. Spróbuj ponownie później.";
    } else if (response.status >= 500) {
      message = "Błąd serwera. Spróbuj ponownie później.";
    }

    throw new ApiError(message, response.status);
  }

  return data;
}