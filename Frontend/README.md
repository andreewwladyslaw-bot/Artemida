# Artemida — Frontend

React + Vite.

## Run

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173/login

## Structure

```
src/
  main.jsx                      entry point, BrowserRouter
  App.jsx                       routes
  index.css                     global styles and design tokens
  components/ui/                shared Button, Input, PasswordInput, icons
  pages/LoginPage/              FE-001 Login Page
  pages/PasswordRecoveryPage/   placeholder for FE-004
```
