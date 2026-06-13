import type { DailySummary } from './api-types';
import { SummaryPanel } from '@/components/data-display';
import { Badge } from '@/components/ui';

export interface ResultSummaryProps {
  summary: DailySummary;
}

export function ResultSummary({ summary }: ResultSummaryProps) {
  return (
    <SummaryPanel
      title="今日成果摘要"
      description={`日期：${summary.date}`}
      items={[
        { id: 'word', label: '单词完成', content: summary.wordCompletedCount },
        { id: 'reading', label: '阅读完成', content: summary.readingCompletedCount },
        { id: 'writing', label: '写作完成', content: summary.writingCompletedCount },
        { id: 'rate', label: '任务完成率', content: `${Math.round(summary.taskCompletionRate)}%` },
      ]}
      actions={
        <Badge variant={summary.streakIncluded ? 'success' : 'neutral'}>
          {summary.streakIncluded ? '计入连续学习' : '未计入连续学习'}
        </Badge>
      }
    />
  );
}
