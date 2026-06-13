import type { PenpalActivityType, SendPenpalLetterResult } from './api-types';
import { penpalActivityLabels } from './business-labels';
import { Timeline } from '@/components/data-display';

export type LetterTimelineItem = SendPenpalLetterResult & {
  occurredAt?: string;
  activityType: PenpalActivityType;
};

export interface LetterTimelineProps {
  items: ReadonlyArray<LetterTimelineItem>;
}

export function LetterTimeline({ items }: LetterTimelineProps) {
  return (
    <Timeline
      ariaLabel="信件时间线"
      items={items.map((item) => ({
        id: item.letterId,
        title: penpalActivityLabels[item.activityType],
        description: `信件 ID：${item.letterId}`,
        ...(item.occurredAt ? { time: item.occurredAt } : {}),
        tone: 'success',
      }))}
    />
  );
}
