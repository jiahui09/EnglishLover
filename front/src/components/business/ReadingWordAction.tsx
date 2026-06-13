import type { AddToWordLearningQueueResult, WordLearningSource, WordQueueStatus } from './api-types';
import { wordQueueStatusLabels, wordSourceLabels } from './business-labels';
import { InlineAlert } from '@/components/feedback';
import { Badge, Button, Card, CardContent } from '@/components/ui';

export interface ReadingWordActionProps {
  articleId: string;
  wordId: string;
  status?: WordQueueStatus;
  source?: WordLearningSource;
  result?: AddToWordLearningQueueResult;
  isSubmitting?: boolean;
  onAdd?: () => void;
}

export function ReadingWordAction({
  articleId,
  wordId,
  status,
  source,
  result,
  isSubmitting = false,
  onAdd,
}: ReadingWordActionProps) {
  const resolvedStatus = result?.status ?? status;
  const resolvedSource = result?.source ?? source;

  return (
    <Card variant="subtle">
      <CardContent className="grid gap-4 pt-6">
        <div className="flex flex-wrap gap-2">
          <Badge size="sm">文章 {articleId}</Badge>
          <Badge variant="info" size="sm">单词 {wordId}</Badge>
          {resolvedStatus ? <Badge variant="success" size="sm">{wordQueueStatusLabels[resolvedStatus]}</Badge> : null}
          {resolvedSource ? <Badge variant="info" size="sm">{wordSourceLabels[resolvedSource]}</Badge> : null}
        </div>
        {resolvedStatus ? (
          <InlineAlert tone={resolvedStatus === 'success' ? 'success' : 'info'} title="加入队列结果">
            {wordQueueStatusLabels[resolvedStatus]}
          </InlineAlert>
        ) : null}
        {onAdd ? (
          <Button isLoading={isSubmitting} onClick={onAdd}>
            加入生词队列
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
