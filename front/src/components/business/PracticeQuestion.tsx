import type { ReactNode } from 'react';

import type { ReviewMode, ReviewRating, WordSummary } from './api-types';
import { reviewModeLabels, wordStageLabels } from './business-labels';
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export type PracticeQuestionOption = {
  id: string;
  label: string;
  description?: string;
};

export interface PracticeQuestionProps {
  word: WordSummary;
  mode: ReviewMode;
  prompt: string;
  options?: ReadonlyArray<PracticeQuestionOption>;
  selectedOptionId?: string;
  rating?: ReviewRating;
  feedback?: ReactNode;
  onSelectOption?: (optionId: string) => void;
  onSubmit?: () => void;
}

export function PracticeQuestion({
  word,
  mode,
  prompt,
  options = [],
  selectedOptionId,
  rating,
  feedback,
  onSelectOption,
  onSubmit,
}: PracticeQuestionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="info" size="sm">
            {reviewModeLabels[mode]}
          </Badge>
          <Badge size="sm">{wordStageLabels[word.stage]}</Badge>
          {typeof rating === 'number' ? <Badge variant="warning" size="sm">评分 {rating}</Badge> : null}
        </div>
        <CardTitle>{word.text}</CardTitle>
        <CardDescription>{word.phonetic ?? '音标字段未提供时由页面层决定是否隐藏。'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-el-main font-semibold">{prompt}</p>
        {options.length > 0 ? (
          <div className="mt-4 grid gap-3" role="listbox" aria-label="练习选项">
            {options.map((option) => {
              const selected = option.id === selectedOptionId;
              return (
                <Button
                  key={option.id}
                  variant={selected ? 'primary' : 'secondary'}
                  fullWidth
                  aria-pressed={selected}
                  onClick={() => onSelectOption?.(option.id)}
                >
                  <span className="grid text-left">
                    <span>{option.label}</span>
                    {option.description ? <span className="text-xs">{option.description}</span> : null}
                  </span>
                </Button>
              );
            })}
          </div>
        ) : null}
        {feedback ? <div className="mt-4">{feedback}</div> : null}
        {onSubmit ? (
          <div className="mt-5">
            <Button onClick={onSubmit}>提交结果</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
