import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import { MemoryRouter } from "react-router";
import { AuthProvider } from "./AuthContext";
import App from "../App";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const userNeedsChange = {
  id: 1,
  role: "student",
  mustChangePassword: true,
};

const userReady = {
  ...userNeedsChange,
  mustChangePassword: false,
};

function mockResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

function openPage(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

async function fillPasswords() {
  await screen.findByRole("heading", {
    name: "Pierwsza zmiana hasła",
  });

  fireEvent.change(screen.getByLabelText("Aktualne hasło"), {
    target: { value: "TemporaryPassword123!" },
  });

  fireEvent.change(screen.getByLabelText("Nowe hasło"), {
    target: { value: "NewSecurePassword123!" },
  });

  fireEvent.change(
    screen.getByLabelText("Potwierdź nowe hasło"),
    {
      target: { value: "NewSecurePassword123!" },
    }
  );
}

it("pomyślnie zmienia hasło i otwiera panel główny", async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(
      mockResponse({ user: userNeedsChange })
    )
    .mockResolvedValueOnce(
      mockResponse({ success: true })
    )
    .mockResolvedValueOnce(
      mockResponse({ user: userReady })
    );

  vi.stubGlobal("fetch", fetchMock);

  openPage("/first-login");

  await fillPasswords();

  fireEvent.click(
    screen.getByRole("button", { name: "Zmień hasło" })
  );

  const continueButton = await screen.findByRole(
    "button",
    { name: "Przejdź do panelu głównego" }
  );

  expect(fetchMock).toHaveBeenCalledWith(
    "/api/auth/change-initial-password",
    expect.objectContaining({
      method: "POST",
    })
  );

  fireEvent.click(continueButton);

  expect(
    await screen.findByRole("heading", { name: "Panel główny EduPlatform" })
  ).toBeTruthy();
});

it("pokazuje błąd zmiany hasła", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn()
      .mockResolvedValueOnce(
        mockResponse({ user: userNeedsChange })
      )
      .mockResolvedValueOnce(
        mockResponse(
          { message: "Aktualne hasło jest nieprawidłowe." },
          400
        )
      )
  );

  openPage("/first-login");

  await fillPasswords();

  fireEvent.click(
    screen.getByRole("button", { name: "Zmień hasło" })
  );

  expect(
    await screen.findByRole("alert")
  ).toHaveProperty("textContent", "Aktualne hasło jest nieprawidłowe.");
});

it("blokuje bezpośredni dostęp do /dashboard", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValueOnce(
      mockResponse({ user: userNeedsChange })
    )
  );

  openPage("/dashboard");

  expect(
    await screen.findByRole("heading", {
      name: "Pierwsza zmiana hasła",
    })
  ).toBeTruthy();

  expect(
    screen.queryByRole("heading", { name: "Panel główny EduPlatform" })
  ).toBeNull();
});

it("po odświeżeniu ponownie sprawdza status użytkownika", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValueOnce(
      mockResponse({ user: userNeedsChange })
    )
  );

  // Nowe uruchomienie aplikacji symuluje odświeżenie strony (F5).
  openPage("/chat");

  expect(
    await screen.findByRole("heading", {
      name: "Pierwsza zmiana hasła",
    })
  ).toBeTruthy();

  expect(
    screen.queryByRole("heading", { name: "Czat" })
  ).toBeNull();
});

it("po zmianie hasła i odświeżeniu pozwala otworzyć panel główny", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValueOnce(
      mockResponse({ user: userReady })
    )
  );

  openPage("/dashboard");

  expect(
    await screen.findByRole("heading", { name: "Panel główny EduPlatform" })
  ).toBeTruthy();
});

it("obsługuje błąd sieci przy zmianie hasła", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn()
      .mockResolvedValueOnce(
        mockResponse({ user: userNeedsChange })
      )
      .mockRejectedValueOnce(new Error("Network error"))
  );

  openPage("/first-login");

  await fillPasswords();

  fireEvent.click(
    screen.getByRole("button", { name: "Zmień hasło" })
  );

  expect(
    await screen.findByRole("alert")
  ).toHaveProperty("textContent", "Brak połączenia z serwerem.");
});