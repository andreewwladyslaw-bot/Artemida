import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { mockResponse, mountAt, needsChange, ready } from './testUtils';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

async function fillPasswords() {
  await screen.findByRole('heading', { name: 'Change your initial password' });
  fireEvent.change(screen.getByLabelText('Current password'), {
    target: { value: 'TemporaryPassword123!' },
  });
  fireEvent.change(screen.getByLabelText('New password'), {
    target: { value: 'NewSecurePassword123!' },
  });
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'NewSecurePassword123!' },
  });
}

it('changes the initial password and continues to Dashboard', async () => {
  const fetchMock = vi.fn()
    .mockResolvedValueOnce(mockResponse({ user: needsChange }))
    .mockResolvedValueOnce(mockResponse({ success: true }))
    .mockResolvedValueOnce(mockResponse({ user: ready }));
  mountAt('/first-login', fetchMock);
  await fillPasswords();
  fireEvent.click(screen.getByRole('button', { name: 'Change password' }));
  const continueButton = await screen.findByRole('button', { name: 'Continue to Dashboard' });
  expect(fetchMock).toHaveBeenCalledWith('/api/auth/change-initial-password',
    expect.objectContaining({ method: 'POST' }));
  fireEvent.click(continueButton);
  expect(await screen.findByRole('heading', { name: 'EduPlatform Dashboard' })).toBeTruthy();
});

it('shows a password-change error from the backend', async () => {
  const mock = vi.fn()
    .mockResolvedValueOnce(mockResponse({ user: needsChange }))
    .mockResolvedValueOnce(mockResponse({ message: 'The current password is incorrect.' }, 400));
  mountAt('/first-login', mock);
  await fillPasswords();
  fireEvent.click(screen.getByRole('button', { name: 'Change password' }));
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'The current password is incorrect.');
});

it('blocks direct URL /dashboard before the required password change', async () => {
  mountAt('/dashboard', vi.fn().mockResolvedValueOnce(mockResponse({ user: needsChange })));
  expect(await screen.findByRole('heading', { name: 'Change your initial password' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'EduPlatform Dashboard' })).toBeNull();
});

it('checks auth state again after a simulated refresh before allowing Chat', async () => {
  mountAt('/chat', vi.fn().mockResolvedValueOnce(mockResponse({ user: needsChange })));
  expect(await screen.findByRole('heading', { name: 'Change your initial password' })).toBeTruthy();
  expect(screen.queryByRole('heading', { name: 'Chat' })).toBeNull();
});

it('allows Dashboard on refresh after the server confirms the change', async () => {
  mountAt('/dashboard', vi.fn().mockResolvedValueOnce(mockResponse({ user: ready })));
  expect(await screen.findByRole('heading', { name: 'EduPlatform Dashboard' })).toBeTruthy();
});

it('shows a network error while changing the initial password', async () => {
  const mock = vi.fn()
    .mockResolvedValueOnce(mockResponse({ user: needsChange }))
    .mockRejectedValueOnce(new Error('network failure'));
  mountAt('/first-login', mock);
  await fillPasswords();
  fireEvent.click(screen.getByRole('button', { name: 'Change password' }));
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Cannot connect to the server.');
});
it('redirects users without a password-change requirement away from first-login', async () => {
  mountAt(
    '/first-login',
    vi.fn().mockResolvedValueOnce(
      mockResponse({ user: ready })
    )
  );

  expect(
    await screen.findByRole('heading', {
      name: 'EduPlatform Dashboard',
    })
  ).toBeTruthy();
});