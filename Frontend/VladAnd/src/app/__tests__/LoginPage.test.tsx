import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockResponse, mountAt, needsChange, ready } from './testUtils';

function mockLoginResponse(response: Response | Error) {
  const fetchMock = vi.fn().mockResolvedValueOnce(mockResponse({ user: null }));
  if (response instanceof Error) fetchMock.mockRejectedValueOnce(response);
  else fetchMock.mockResolvedValueOnce(response);
  return fetchMock;
}

async function enterCredentials(login = 'student1', password = 'TestPassword123!') {
  await screen.findByRole('heading', { name: 'Login' });
  fireEvent.change(screen.getByLabelText('Login'), { target: { value: login } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
}

function submitLogin() {
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
}

function loginCalls(mock: ReturnType<typeof vi.fn>) {
  return mock.mock.calls.filter(([url]) => url === '/api/auth/login');
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('renders Login, Password, submit button and recovery link', async () => {
  mountAt('/login', vi.fn().mockResolvedValueOnce(mockResponse({ user: null })));
  await screen.findByRole('heading', { name: 'Login' });
  expect(screen.getByLabelText('Login')).toBeTruthy();
  expect(screen.getByLabelText('Password')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
  fireEvent.click(screen.getByRole('link', { name: 'Forgot your password?' }));
  expect(await screen.findByRole('heading', { name: 'Recover access' })).toBeTruthy();
});

it('rejects an empty login without sending a POST', async () => {
  const mock = vi.fn().mockResolvedValueOnce(mockResponse({ user: null }));
  mountAt('/login', mock);
  await enterCredentials('', 'abc'); submitLogin();
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Please enter your login.');
  expect(loginCalls(mock)).toHaveLength(0);
});

it('rejects an empty password without sending a POST', async () => {
  const mock = vi.fn().mockResolvedValueOnce(mockResponse({ user: null }));
  mountAt('/login', mock);
  await enterCredentials('student1', ''); submitLogin();
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Please enter your password.');
  expect(loginCalls(mock)).toHaveLength(0);
});

it('can show and hide the entered password', async () => {
  mountAt('/login', vi.fn().mockResolvedValueOnce(mockResponse({ user: null })));
  await enterCredentials();
  const input = screen.getByLabelText('Password') as HTMLInputElement;
  expect(input.type).toBe('password');
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(input.type).toBe('text');
  fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
  expect(input.type).toBe('password');
});

it('requires initial password change and preserves the exact submitted password', async () => {
  const mock = mockLoginResponse(mockResponse({ user: needsChange }));
  mountAt('/login', mock);
  const enteredPassword = '  Keep spaces 123! ';
  await enterCredentials('student1', enteredPassword); submitLogin();
  expect(await screen.findByRole('heading', { name: 'Change your initial password' })).toBeTruthy();
  expect(loginCalls(mock)).toHaveLength(1);
  expect(loginCalls(mock)[0][1]).toEqual(expect.objectContaining({
    method: 'POST', body: JSON.stringify({ login: 'student1', password: enteredPassword }),
  }));
});

it('opens Dashboard when initial password change is not required', async () => {
  mountAt('/login', mockLoginResponse(mockResponse({ user: ready })));
  await enterCredentials(); submitLogin();
  expect(await screen.findByRole('heading', { name: 'EduPlatform Dashboard' })).toBeTruthy();
});

it.each([
  [401, 'Invalid credentials or your session has expired.'],
  [429, 'Too many attempts. Please try again later.'],
  [500, 'Server error. Please try again later.'],
  [403, 'Access denied.'],
  [502, 'Server error. Please try again later.'],
])('shows a useful error for HTTP %i', async (status, message) => {
  mountAt('/login', mockLoginResponse(mockResponse({}, status)));
  await enterCredentials(); submitLogin();
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', message);
});

it('shows a useful network error', async () => {
  mountAt('/login', mockLoginResponse(new Error('network failure')));
  await enterCredentials(); submitLogin();
  expect(await screen.findByRole('alert')).toHaveProperty('textContent', 'Cannot connect to the server.');
});

it('does not allow a duplicate Login submission while loading', async () => {
  let resolveLogin: (value: Response) => void = () => {};
  const pending = new Promise<Response>((resolve) => { resolveLogin = resolve; });
  const mock = vi.fn()
    .mockResolvedValueOnce(mockResponse({ user: null }))
    .mockImplementationOnce(() => pending);
  mountAt('/login', mock);
  await enterCredentials(); submitLogin();
  const button = screen.getByRole('button', { name: 'Signing in...' }) as HTMLButtonElement;
  expect(button.disabled).toBe(true);
  fireEvent.click(button);
  expect(loginCalls(mock)).toHaveLength(1);
  await act(async () => { resolveLogin(mockResponse({ user: ready })); });
  expect(await screen.findByRole('heading', { name: 'EduPlatform Dashboard' })).toBeTruthy();
});
