import type { ReactNode } from 'react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export type ReadingQuestionOption = {
  id: string;
  label: string;
  description?: string;
};

export interface ReadingQuestionPanelProps {
  articleId: string;
  title: string;
  prompt: string;
  options: ReadonlyArray<ReadingQuestionOption>;
  selectedOptionId?: string;
  feedback?: ReactNode;
  onSelectOption?: (optionId: string) => void;
  onSubmit?: () => void;
}

export function ReadingQuestionPanel({
  articleId,
  title,
  prompt,
  options,
  selectedOptionId,
  feedback,
  onSelectOption,
  onSubmit,
}: ReadingQuestionPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>关联文章：{articleId}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-el-main font-semibold">{prompt}</p>
        <div className="mt-4 grid gap-3" role="listbox" aria-label="阅读题选项">
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
        {feedback ? <div className="mt-4">{feedback}</div> : null}
        {onSubmit ? (
          <div className="mt-5">
            <Button onClick={onSubmit}>提交阅读题</Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
