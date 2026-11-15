# EduPlatform — Feature-Based React + TypeScript

The original EduPlatform Login / Initial Password Change / Dashboard UI has been refactored from React JavaScript into **React + TypeScript**. All user-facing strings, validation messages, error messages, and test descriptions are in **English**.

This layout follows the team architecture guide `feature_based_architecture_react_typescript(1).pdf`.

## Requirements

- Node.js **22.12+** (the dependency versions inherited from the original project target newer Node.js releases).
- npm
- Backend implementing the documented authentication endpoints for real sign-in. No fake production credentials are included.

## Install and run

```powershell
cd C:\Projects\Artemida\Frontend\VladAnd
npm install
npm run dev
```

For a standalone unzip use the folder where you extracted this archive instead. Then visit `http://localhost:5173/login`.

```powershell
npm run check:architecture
npm run typecheck
npm run test
npm run build
```

The archive intentionally excludes `node_modules` and `dist`. It does **not** carry the old `package-lock.json` because package dependencies changed to introduce TypeScript and React type definitions. Run `npm install` once to create a fresh lockfile and commit that lockfile with your code.

## Architecture

```text
src/
  app/          # main.tsx, providers.tsx, routes.tsx — composition only
  features/
    auth/       # api/, components/, hooks/, types/, index.ts
    dashboard/  # components/, index.ts
  shared/
    api/        # generic HTTP client, no auth business rules
    ui/         # generic UI and global styles
  layouts/      # reusable page template
```

Rules:

1. Do not add any other top-level folder below `src/`.
2. Import another feature **only from its `index.ts`**. Example: `import { LoginPage } from '@/features/auth'`.
3. A feature may import `shared`, but never another feature or the internals of `app`.
4. Keep auth-specific error strings and API calls inside `features/auth`.
5. `app` only composes routes and providers; no auth requests or auth state there.
6. Place code and tests that change together near their feature or integration boundary.

## Authentication contract (real backend required)

The frontend expects an HTTP backend. During development it sends requests to `/api/...`:

| Frontend request | Backend endpoint | JSON result |
|---|---|---|
| `POST /api/auth/login` | `POST /auth/login` | `{ "user": { "id": 1, "login": "student1", "role": "student", "mustChangePassword": true } }` |
| `GET /api/auth/me` | `GET /auth/me` | `{ "user": null }` (not signed in), or the current user |
| `POST /api/auth/change-initial-password` | `POST /auth/change-initial-password` | `{ "success": true }` |

For first password change, body: `{ "currentPassword": "...", "newPassword": "..." }`.

If your backend is reachable at `http://localhost:8000`, create `.env.local` with:

```env
VITE_API_TARGET=http://localhost:8000
```

Vite proxies `/api/auth/...` to `/auth/...`. If the backend uses different routes or response fields, adapt `src/features/auth/api/authApi.ts` to the **real** contract. Never store passwords in localStorage. Cookie sessions require server-side CSRF protection and correct cookie security attributes. The server must also enforce the `mustChangePassword` restriction — `AuthGuard` is only a UI guard.

The password recovery page is an informational contact-administrator flow, **not** an email reset endpoint. Calendar, Chat, and Profile are placeholders. Dashboard statistics are sample zero values until an API is added.

## Tests

The `src/app/__tests__/` folder contains 17 mock-backed integration tests:

- 11 sign-in tests: fields, validation, password visibility, success with/without initial password reset, HTTP 401/429/500, network failure, repeated submit prevention.
- 6 initial-password tests: success, HTTP error, direct URL blocking, simulated refresh, dashboard after verified reset, network failure.

Tests use mocked HTTP responses. They do not prove that a backend is deployed or secure.

## Moving into Artemida safely

This archive contains **the EduPlatform application root**, not the Git repository. Back up the original project; place the application files into your **own directory**, `Frontend/VladAnd/`, without replacing the parent `Frontend` or changing any other team member's files. Create a feature branch from the current `upstream/Frontend`, verify `git diff --name-status upstream/Frontend...HEAD`, then create a PR targeting **Frontend**. Never force-push shared branches.
