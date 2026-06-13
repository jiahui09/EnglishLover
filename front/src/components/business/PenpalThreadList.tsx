import type { PenpalThreadSummary } from './api-types';
import { sessionStatusLabels, sessionStatusTone } from './business-labels';
import { DataList } from '@/components/data-display';
import { EmptyState } from '@/components/feedback';
import { Badge, Button } from '@/components/ui';

export interface PenpalThreadListProps {
  threads: ReadonlyArray<PenpalThreadSummary>;
  onOpenThread?: (threadId: string) => void;
}

export function PenpalThreadList({ threads, onOpenThread }: PenpalThreadListProps) {
  return (
    <DataList
      ariaLabel="笔友线程列表"
      empty={<EmptyState title="暂无笔友线程" description="当前没有可展示的笔友线程。" />}
      items={threads.map((thread) => ({
        id: thread.threadId,
        title: `线程 ${thread.threadId}`,
        description: '线程状态来自冻结接口类型。',
        meta: (
          <Badge variant={sessionStatusTone[thread.status]} size="sm">
            {sessionStatusLabels[thread.status]}
          </Badge>
        ),
        action: onOpenThread ? (
          <Button variant="secondary" size="sm" onClick={() => onOpenThread(thread.threadId)}>
            打开
          </Button>
        ) : null,
      }))}
    />
  );
}
