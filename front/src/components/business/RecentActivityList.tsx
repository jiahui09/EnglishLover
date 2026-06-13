import type { ReviewEvent } from './api-types';
import { moduleLabels } from './business-labels';
import { Timeline } from '@/components/data-display';

export interface RecentActivityListProps {
  events: ReadonlyArray<ReviewEvent>;
}

export function RecentActivityList({ events }: RecentActivityListProps) {
  return (
    <Timeline
      ariaLabel="近期学习活动"
      items={events.map((event) => ({
        id: event.eventId,
        title: moduleLabels[event.module],
        description: `事件 ID：${event.eventId}`,
        time: event.occurredAt,
        tone: 'info',
      }))}
    />
  );
}
