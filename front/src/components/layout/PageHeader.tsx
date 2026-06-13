import type { ReactNode } from 'react';

import { Badge } from '@/components/ui';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  status?: string;
  actions?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, status, actions }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="text-el-primary mb-2 text-sm font-bold">{eyebrow}</p> : null}
        <h1 className="text-el-main text-3xl leading-tight font-black tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="text-el-subtle mt-4 text-base sm:text-lg">{description}</p>
        {status ? (
          <div className="mt-4">
            <Badge variant="info">{status}</Badge>
          </div>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
