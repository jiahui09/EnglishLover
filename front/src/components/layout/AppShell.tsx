import type { ReactNode } from 'react';

import { Badge } from '@/components/ui';
import { navigateTo } from '@/lib/navigation';
import { shellRoutes } from '@/lib/routes';

export interface AppShellProps {
  currentPath: string;
  children: ReactNode;
}

function handleNavigate(event: React.MouseEvent<HTMLAnchorElement>, path: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  navigateTo(path);
}

export function AppShell({ currentPath, children }: AppShellProps) {
  const mobileRoutes = shellRoutes.slice(0, 4);

  return (
    <div className="el-shell grid min-h-screen lg:grid-cols-[18rem_1fr]">
      <aside className="el-shell__sidebar hidden min-h-screen p-6 lg:block">
        <div className="mb-8">
          <p className="text-el-primary mb-2 text-sm font-bold">EnglishLover</p>
          <h1 className="text-el-main text-2xl font-black tracking-tight">Web Foundation</h1>
          <p className="text-el-subtle mt-3 text-sm">第一轮：只搭框架，不做业务页。</p>
        </div>
        <nav aria-label="主导航" className="grid gap-2">
          {shellRoutes.map((route) => (
            <a
              key={route.path}
              href={route.path}
              className="el-nav-link"
              aria-current={currentPath === route.path ? 'page' : undefined}
              onClick={(event) => handleNavigate(event, route.path)}
            >
              <span>{route.label}</span>
              {route.path === '/components' ? <Badge size="sm">Demo</Badge> : null}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="border-el-border bg-el-surface/95 sticky top-0 z-20 border-b px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-el-primary text-sm font-bold">EnglishLover</p>
              <p className="text-el-subtle text-xs">框架已建好，业务待接入</p>
            </div>
            <Badge variant="info" size="sm">
              M1
            </Badge>
          </div>
        </header>

        <main className="min-h-screen flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>

        <nav className="el-mobile-nav lg:hidden" aria-label="移动端导航占位">
          {mobileRoutes.map((route) => (
            <a
              key={route.path}
              href={route.path}
              aria-current={currentPath === route.path ? 'page' : undefined}
              onClick={(event) => handleNavigate(event, route.path)}
            >
              {route.shortLabel}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
