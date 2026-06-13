import type { ReactNode } from 'react';

import type { LearningModule, SessionStatus } from './api-types';
import { moduleLabels, sessionStatusLabels, sessionStatusTone } from './business-labels';
import { EmptyState } from '@/components/feedback';
import { Badge, Button, Card } from '@/components/ui';

export type TodayTaskListItem = {
  id: string;
  module: LearningModule;
  title: string;
  description?: string;
  status: SessionStatus;
  actionLabel?: string;
  onAction?: () => void;
  meta?: ReactNode;
};

export interface TodayTaskListProps {
  items: ReadonlyArray<TodayTaskListItem>;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TodayTaskList({
  items,
  emptyTitle = '暂无今日任务',
  emptyDescription = '当前没有可展示的任务。页面层应只传入真实接口返回的任务。',
}: TodayTaskListProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Card variant="outlined">
      <ul className="divide-el-border divide-y" aria-label="今日任务列表">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-start justify-between gap-4 p-4">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge variant="info" size="sm">
                  {moduleLabels[item.module]}
                </Badge>
                <Badge variant={sessionStatusTone[item.status]} size="sm">
                  {sessionStatusLabels[item.status]}
                </Badge>
                {item.meta}
              </div>
              <h3 className="text-el-main m-0 font-bold">{item.title}</h3>
              {item.description ? (
                <p className="text-el-subtle mt-1 text-sm">{item.description}</p>
              ) : null}
            </div>
            {item.actionLabel && item.onAction ? (
              <Button variant="secondary" size="sm" onClick={item.onAction}>
                {item.actionLabel}
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
