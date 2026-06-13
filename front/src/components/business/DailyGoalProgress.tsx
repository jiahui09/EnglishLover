import type { DailySummary } from './api-types';
import { ProgressIndicator } from '@/components/feedback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface DailyGoalProgressProps {
  summary: DailySummary;
}

export function DailyGoalProgress({ summary }: DailyGoalProgressProps) {
  return (
    <Card variant="subtle">
      <CardHeader>
        <CardTitle>今日目标进度</CardTitle>
        <CardDescription>进度值来自 DailySummary.taskCompletionRate。</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator label={summary.date} value={summary.taskCompletionRate} />
      </CardContent>
    </Card>
  );
}
