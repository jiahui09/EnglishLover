import type { WordStage } from './api-types';
import { wordStageLabels } from './business-labels';
import { Badge } from '@/components/ui';

export interface WordStatusBadgeProps {
  stage: WordStage;
}

export function WordStatusBadge({ stage }: WordStatusBadgeProps) {
  return (
    <Badge variant="info" size="sm">
      {wordStageLabels[stage]}
    </Badge>
  );
}
