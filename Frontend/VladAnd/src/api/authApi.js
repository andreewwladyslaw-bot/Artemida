import { apiRequest } from "./apiClient";

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

export function loginRequest(login, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ login, password }),
  });
}

export function changeInitialPassword(
  currentPassword,
  newPassword
) {
  return apiRequest("/auth/change-initial-password", {
    method: "POST",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}