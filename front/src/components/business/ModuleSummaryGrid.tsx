import type { DailySummary, LearningModule } from './api-types';
import { moduleLabels } from './business-labels';
import { StatCard } from '@/components/data-display';

export type ModuleSummaryGridItem = {
  module: LearningModule;
  value: number;
  description?: string;
};

export interface ModuleSummaryGridProps {
  summary?: DailySummary;
  items?: ReadonlyArray<ModuleSummaryGridItem>;
}

export function ModuleSummaryGrid({ summary, items }: ModuleSummaryGridProps) {
  const resolvedItems = items ?? (summary ? [
    { module: 'word' as const, value: summary.wordCompletedCount, description: '单词完成数量' },
    { module: 'reading' as const, value: summary.readingCompletedCount, description: '阅读完成数量' },
    { module: 'writing' as const, value: summary.writingCompletedCount, description: '写作完成数量' },
  ] : []);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {resolvedItems.map((item) => (
        <StatCard
          key={item.module}
          label={moduleLabels[item.module]}
          value={item.value}
          {...(item.description ? { description: item.description } : {})}
          tone="info"
          trendLabel="真实字段"
        />
      ))}
    </div>
  );
}
