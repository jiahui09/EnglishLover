import type { ReactNode } from 'react';

import { InlineAlert } from '@/components/feedback';

export type SafetyNoticeTone = 'info' | 'success' | 'warning' | 'danger';

export interface SafetyNoticeProps {
  tone?: SafetyNoticeTone;
  title: string;
  children: ReactNode;
}

export function SafetyNotice({ tone = 'info', title, children }: SafetyNoticeProps) {
  return (
    <InlineAlert tone={tone} title={title}>
      {children}
    </InlineAlert>
  );
}
