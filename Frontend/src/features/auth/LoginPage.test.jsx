
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

import LoginPage from './LoginPage';
import { signIn } from './authService';
import { ApiError } from '../../shared/api/client';

vi.mock('./authService', () => ({
  signIn: vi.fn(),
}));

function renderLogin() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/first-login"
          element={<h1>First login page</h1>}
        />
        <Route
          path="/Dashboard"
          element={<h1>Dashboard</h1>}
        />
      </Routes>
    </MemoryRouter>
  );
}

async function fillLoginForm(user) {
  await user.type(screen.getByLabelText('Login'), 'alice');
  await user.type(screen.getByLabelText('Password'), 'secret123');
}

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  cleanup();
});

describe('LoginPage', () => {
  it('shows a validation error for empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Login and password are required.'
    );

    expect(signIn).not.toHaveBeenCalled();
  });

  it('redirects to Dashboard after successful login', async () => {
    signIn.mockResolvedValue({
      mustChangePassword: false,
    });

    const user = userEvent.setup();
    renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(signIn).toHaveBeenCalledWith({
      login: 'alice',
      password: 'secret123',
    });

    expect(
      await screen.findByRole('heading', { name: 'Dashboard' })
    ).toBeInTheDocument();
  });

  it('redirects to first login when password change is required', async () => {
    signIn.mockResolvedValue({
      mustChangePassword: true,
    });

    const user = userEvent.setup();
    renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(
      await screen.findByRole('heading', {
        name: 'First login page',
      })
    ).toBeInTheDocument();
  });

  it('shows an error for invalid credentials', async () => {
    signIn.mockRejectedValue(new ApiError(401));

    const user = userEvent.setup();
    renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent('Invalid login or password.');
  });

  it.each([
    [429, 'Too many login attempts.'],
    [503, 'Server is temporarily unavailable.'],
    [0, 'Cannot connect to the server.'],
  ])('handles HTTP/network status %i', async (status, message) => {
    signIn.mockRejectedValue(new ApiError(status));

    const user = userEvent.setup();
    renderLogin();

    await fillLoginForm(user);

    await user.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(message);
  });

  it('prevents duplicate submissions while loading', async () => {
    let finishLogin;

    signIn.mockImplementation(
      () => new Promise((resolve) => {
        finishLogin = resolve;
      })
    );

    const user = userEvent.setup();
    renderLogin();

    await fillLoginForm(user);

    const button = screen.getByRole('button', {
      name: 'Sign in',
    });

    await user.click(button);

    expect(button).toBeDisabled();
    expect(signIn).toHaveBeenCalledTimes(1);

    await user.click(button);

    expect(signIn).toHaveBeenCalledTimes(1);

    await act(async () => {
      finishLogin({ mustChangePassword: false });
    });

    expect(
      await screen.findByRole('heading', { name: 'Dashboard' })
    ).toBeInTheDocument();
  });
});
