import { AppShell } from '@/components/layout';
import { ToastProvider } from '@/components/ui';
import { findShellRoute } from '@/lib/routes';
import { useCurrentPath } from '@/lib/useCurrentPath';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ShellPlaceholderPage } from '@/pages/ShellPlaceholderPage';

function renderPage(path: string) {
  if (path === '/') {
    return <HomePage />;
  }

  if (path === '/components') {
    return <ComponentsPage />;
  }

  const route = findShellRoute(path);

  if (route) {
    return <ShellPlaceholderPage route={route} />;
  }

  return <NotFoundPage />;
}

export function App() {
  const path = useCurrentPath();

  return (
    <ToastProvider>
      <AppShell currentPath={path}>{renderPage(path)}</AppShell>
    </ToastProvider>
  );
}
