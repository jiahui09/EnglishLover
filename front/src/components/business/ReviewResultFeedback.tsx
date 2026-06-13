import type { ReviewSubmitResult } from './api-types';
import { FeedbackPanel } from '@/components/feedback';
import { Badge } from '@/components/ui';

export interface ReviewResultFeedbackProps {
  result: ReviewSubmitResult;
  title?: string;
}

export function ReviewResultFeedback({ result, title = '复习结果已记录' }: ReviewResultFeedbackProps) {
  return (
    <FeedbackPanel
      tone={result.status === 'accepted' ? 'success' : 'info'}
      title={title}
      actions={<Badge variant="success">{result.status}</Badge>}
    >
      复习事件 ID：{result.reviewEventId}
      {result.nextReviewAt ? `；下次复习时间：${result.nextReviewAt}` : ''}
    </FeedbackPanel>
  );
}
