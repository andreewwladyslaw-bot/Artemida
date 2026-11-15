import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './providers';
import { AppRoutes } from './routes';
import '@/shared/ui/base.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element.');
createRoot(root).render(
  <StrictMode>
    <AppProviders><AppRoutes /></AppProviders>
  </StrictMode>,
);
