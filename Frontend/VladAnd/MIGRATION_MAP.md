# Migration guide (English)

Copy the application into an **isolated branch**, not directly into the shared `Frontend` branch. The PDF sets four permitted top-level directories under `src`: `app`, `features`, `shared`, and `layouts`.

| Old file in Dashboard(3).zip | New file |
|---|---|
| `src/main.jsx` | `src/app/main.tsx` |
| `src/App.jsx` | `src/app/routes.tsx` |
| `src/api/apiClient.js` | `src/shared/api/apiClient.ts` |
| `src/api/authApi.js` | `src/features/auth/api/authApi.ts` |
| `src/auth/AuthContext.jsx` | `src/features/auth/components/AuthProvider.tsx` + `hooks/useAuth.ts` |
| `src/auth/AuthGuard.jsx` | `src/features/auth/components/AuthGuard.tsx` |
| `src/pages/LoginPage.jsx` | `src/features/auth/components/LoginPage.tsx` |
| `src/pages/FirstLoginPage.jsx` | `src/features/auth/components/FirstLoginPage.tsx` |
| `src/pages/ForgotPasswordPage.jsx` | `src/features/auth/components/ForgotPasswordPage.tsx` |
| `src/pages/Dashboard.jsx` | `src/features/dashboard/components/DashboardPage.tsx` |
| `src/auth/LoginPage.test.jsx` | `src/app/__tests__/LoginPage.test.tsx` |
| `src/auth/authFlow.test.jsx` | `src/app/__tests__/authFlow.test.tsx` |
| `src/index.css` | `src/shared/ui/base.css` + feature-local CSS |
| `vite.config.js` | `vite.config.ts` |

Test helpers are in `src/app/__tests__/testUtils.tsx`; API error strings are localized inside the auth feature.

**Important:** Remove the *old files only inside your own application folder* after confirming the new ones work. A normal ZIP extraction does not delete stale `.jsx` files. Do not remove other participants' source code or override the parent `Frontend` directory. Make a backup first.

Run:

```powershell
npm install
npm run check:architecture
npm run typecheck
npm run test
npm run build
```

The `check:architecture` script covers basic folder/import boundaries; also manually review the PR checklist from the PDF (domain logic, feature responsibilities, and co-location).
