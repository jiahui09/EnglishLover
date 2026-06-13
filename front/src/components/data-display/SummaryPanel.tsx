import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export type SummaryPanelItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export interface SummaryPanelProps {
  title: string;
  description?: string;
  items: ReadonlyArray<SummaryPanelItem>;
  actions?: ReactNode;
}

export function SummaryPanel({ title, description, items, actions }: SummaryPanelProps) {
  return (
    <Card variant="subtle">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-tokenLg border-el-border bg-el-surface border p-4"
            >
              <dt className="text-el-subtle text-sm font-semibold">{item.label}</dt>
              <dd className="text-el-main mt-2 text-base font-bold">{item.content}</dd>
            </div>
          ))}
        </dl>
        {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}
