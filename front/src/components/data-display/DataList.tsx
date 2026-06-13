import type { ReactNode } from 'react';

import { Card } from '@/components/ui';

export type DataListItem = {
  id: string;
  title: string;
  description?: string;
  meta?: ReactNode;
  leading?: ReactNode;
  action?: ReactNode;
};

export interface DataListProps {
  items: ReadonlyArray<DataListItem>;
  empty?: ReactNode;
  ariaLabel?: string;
}

export function DataList({ items, empty, ariaLabel = '数据列表' }: DataListProps) {
  if (items.length === 0) {
    return <>{empty ?? null}</>;
  }

  return (
    <Card variant="outlined">
      <ul className="divide-el-border divide-y" aria-label={ariaLabel}>
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-4 p-4">
            {item.leading ? <div className="shrink-0">{item.leading}</div> : null}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-el-main m-0 font-bold">{item.title}</h3>
                {item.meta}
              </div>
              {item.description ? (
                <p className="text-el-subtle mt-1 text-sm">{item.description}</p>
              ) : null}
            </div>
            {item.action ? <div className="shrink-0">{item.action}</div> : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
