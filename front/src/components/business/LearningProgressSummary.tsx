import type { DailySummary } from './api-types';
import { DailyGoalProgress } from './DailyGoalProgress';
import { ModuleSummaryGrid } from './ModuleSummaryGrid';

export interface LearningProgressSummaryProps {
  summary: DailySummary;
}

export function LearningProgressSummary({ summary }: LearningProgressSummaryProps) {
  return (
    <div className="grid gap-5">
      <DailyGoalProgress summary={summary} />
      <ModuleSummaryGrid summary={summary} />
    </div>
  );
}
