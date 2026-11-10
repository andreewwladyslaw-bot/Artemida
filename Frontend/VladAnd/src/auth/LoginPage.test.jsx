import { afterEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "./AuthContext";
import App from "../App";

const needsChange = {
  id: 1,
  login: "student1",
  role: "student",
  mustChangePassword: true,
};
const ready = { ...needsChange, mustChangePassword: false };

function mockResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function renderAtLogin(fetchMock) {
  vi.stubGlobal("fetch", fetchMock);
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

function mockLoginResponse(response) {
  // Najpierw GET /auth/me — użytkownik nie jest zalogowany.
  const mock = vi.fn().mockResolvedValueOnce(mockResponse({ user: null }));
  if (response instanceof Error) {
    mock.mockRejectedValueOnce(response);
  } else {
    mock.mockResolvedValueOnce(response);
  }
  return mock;
}

async function enterCredentials(login = "student1", password = "TestPassword123!") {
  await screen.findByRole("heading", { name: "Logowanie" });
  fireEvent.change(screen.getByLabelText("Login"), {
    target: { value: login },
  });
  fireEvent.change(screen.getByLabelText("Hasło"), {
    target: { value: password },
  });
}

function submitLogin() {
  fireEvent.click(screen.getByRole("button", { name: "Zaloguj się" }));
}

function loginCalls(fetchMock) {
  return fetchMock.mock.calls.filter(([url]) => url === "/api/auth/login");
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("wyświetla pola i link do odzyskiwania dostępu", async () => {
  renderAtLogin(vi.fn().mockResolvedValueOnce(mockResponse({ user: null })));
  await screen.findByRole("heading", { name: "Logowanie" });
  expect(screen.getByLabelText("Login")).toBeTruthy();
  expect(screen.getByLabelText("Hasło")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Zaloguj się" })).toBeTruthy();
  fireEvent.click(screen.getByRole("link", { name: "Nie pamiętasz hasła?" }));
  expect(await screen.findByRole("heading", { name: "Odzyskiwanie dostępu" })).toBeTruthy();
});

it("nie wysyła formularza bez loginu", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce(mockResponse({ user: null }));
  renderAtLogin(fetchMock);
  await enterCredentials("", "abc");
  submitLogin();
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Wprowadź login.");
  expect(loginCalls(fetchMock)).toHaveLength(0);
});

it("nie wysyła formularza bez hasła", async () => {
  const fetchMock = vi.fn().mockResolvedValueOnce(mockResponse({ user: null }));
  renderAtLogin(fetchMock);
  await enterCredentials("student1", "");
  submitLogin();
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Wprowadź hasło.");
  expect(loginCalls(fetchMock)).toHaveLength(0);
});

it("pokazuje i ukrywa hasło", async () => {
  renderAtLogin(vi.fn().mockResolvedValueOnce(mockResponse({ user: null })));
  await enterCredentials();
  const passwordInput = screen.getByLabelText("Hasło");
  expect(passwordInput.type).toBe("password");
  fireEvent.click(screen.getByRole("button", { name: "Pokaż hasło" }));
  expect(passwordInput.type).toBe("text");
  fireEvent.click(screen.getByRole("button", { name: "Ukryj hasło" }));
  expect(passwordInput.type).toBe("password");
});

it("po zalogowaniu wymaga pierwszej zmiany hasła", async () => {
  const fetchMock = mockLoginResponse(mockResponse({ user: needsChange }));
  renderAtLogin(fetchMock);
  const originalPassword = "  Keep spaces 123! ";
  await enterCredentials("student1", originalPassword);
  submitLogin();
  expect(await screen.findByRole("heading", { name: "Pierwsza zmiana hasła" })).toBeTruthy();
  expect(loginCalls(fetchMock)).toHaveLength(1);
  expect(loginCalls(fetchMock)[0][1]).toEqual(expect.objectContaining({
    method: "POST",
    body: JSON.stringify({ login: "student1", password: originalPassword }),
  }));
});

it("po zalogowaniu otwiera panel główny", async () => {
  const fetchMock = mockLoginResponse(mockResponse({ user: ready }));
  renderAtLogin(fetchMock);
  await enterCredentials();
  submitLogin();
  expect(await screen.findByRole("heading", { name: "Panel główny EduPlatform" })).toBeTruthy();
});

it.each([
  [401, "Nieprawidłowe dane logowania lub sesja wygasła."],
  [429, "Zbyt wiele prób. Spróbuj ponownie później."],
  [500, "Błąd serwera. Spróbuj ponownie później."],
])("wyświetla właściwy komunikat dla HTTP %i", async (status, message) => {
  const fetchMock = mockLoginResponse(mockResponse({}, status));
  renderAtLogin(fetchMock);
  await enterCredentials();
  submitLogin();
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", message);
});

it("wyświetla błąd połączenia z siecią", async () => {
  const fetchMock = mockLoginResponse(new Error("Network failure"));
  renderAtLogin(fetchMock);
  await enterCredentials();
  submitLogin();
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Brak połączenia z serwerem.");
});

it("podczas logowania blokuje ponowne wysłanie formularza", async () => {
  let resolveLogin;
  const pending = new Promise((resolve) => {
    resolveLogin = resolve;
  });
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(mockResponse({ user: null }))
    .mockImplementationOnce(() => pending);
  renderAtLogin(fetchMock);
  await enterCredentials();
  submitLogin();

  const button = screen.getByRole("button", { name: "Logowanie..." });
  expect(button.disabled).toBe(true);
  fireEvent.click(button);
  expect(loginCalls(fetchMock)).toHaveLength(1);

  await act(async () => {
    resolveLogin(mockResponse({ user: ready }));
  });
  expect(await screen.findByRole("heading", { name: "Panel główny EduPlatform" })).toBeTruthy();
});
