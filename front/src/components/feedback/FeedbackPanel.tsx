import type { ReactNode } from 'react';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type BadgeVariant,
} from '@/components/ui';

export type FeedbackTone = 'info' | 'success' | 'warning' | 'danger';

const feedbackBadge: Record<FeedbackTone, BadgeVariant> = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
};

export interface FeedbackPanelProps {
  tone?: FeedbackTone;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function FeedbackPanel({ tone = 'info', title, children, actions }: FeedbackPanelProps) {
  return (
    <Card className={`el-feedback-panel el-feedback-panel--${tone}`}>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={feedbackBadge[tone]} size="sm">
            {tone}
          </Badge>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-el-subtle text-sm">{children}</div>
        {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}
