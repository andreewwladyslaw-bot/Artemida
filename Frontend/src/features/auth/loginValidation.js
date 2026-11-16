
export function validateLogin(credentials) {
  if (
    typeof credentials.login !== 'string' ||
    !credentials.login.trim() ||
    typeof credentials.password !== 'string' ||
    !credentials.password.trim()
  ) {
    return 'Login and password are required.';
  }

  return '';
}

