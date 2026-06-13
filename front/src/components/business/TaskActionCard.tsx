import type { ReactNode } from 'react';

import type { LearningModule, SessionStatus } from './api-types';
import { moduleLabels, sessionStatusLabels, sessionStatusTone } from './business-labels';
import { ProgressIndicator } from '@/components/feedback';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';

export interface TaskActionCardProps {
  module: LearningModule;
  title: string;
  description: string;
  status: SessionStatus;
  progressValue?: number;
  progressMax?: number;
  action?: ReactNode;
  meta?: ReactNode;
}

export function TaskActionCard({
  module,
  title,
  description,
  status,
  progressValue,
  progressMax,
  action,
  meta,
}: TaskActionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="info" size="sm">
                {moduleLabels[module]}
              </Badge>
              <Badge variant={sessionStatusTone[status]} size="sm">
                {sessionStatusLabels[status]}
              </Badge>
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {meta ? <div className="shrink-0">{meta}</div> : null}
        </div>
      </CardHeader>
      {typeof progressValue === 'number' ? (
        <CardContent>
          <ProgressIndicator
            label="任务进度"
            value={progressValue}
            max={progressMax ?? 100}
            tone={status === 'completed' ? 'success' : 'primary'}
          />
        </CardContent>
      ) : null}
      {action ? <CardFooter>{action}</CardFooter> : null}
    </Card>
  );
}
