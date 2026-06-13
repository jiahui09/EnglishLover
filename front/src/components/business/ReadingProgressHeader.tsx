import type { ReadingArticleSummary } from './api-types';
import { ProgressIndicator } from '@/components/feedback';
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface ReadingProgressHeaderProps {
  article: ReadingArticleSummary;
  progressValue: number;
  progressMax?: number;
}

export function ReadingProgressHeader({
  article,
  progressValue,
  progressMax = 100,
}: ReadingProgressHeaderProps) {
  return (
    <Card variant="subtle">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>{article.title}</CardTitle>
            <CardDescription>阅读进度由页面层传入，组件不自行计算。</CardDescription>
          </div>
          {article.level ? <Badge variant="info">{article.level}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <ProgressIndicator label="阅读进度" value={progressValue} max={progressMax} />
      </CardContent>
    </Card>
  );
}
