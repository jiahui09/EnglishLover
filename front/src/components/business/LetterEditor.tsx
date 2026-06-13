import type { ReactNode } from 'react';

import type { SendPenpalLetterRequest } from './api-types';
import { SaveStatus, type SaveStatusValue } from '@/components/feedback';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Textarea } from '@/components/ui';

export interface LetterEditorProps {
  draft: SendPenpalLetterRequest;
  saveStatus: SaveStatusValue;
  helperText?: string;
  safetySlot?: ReactNode;
  actions?: ReactNode;
  onBodyChange?: (body: string) => void;
  onSubmit?: () => void;
}

export function LetterEditor({
  draft,
  saveStatus,
  helperText = '写信正文由页面层维护，组件不直接请求接口或保存草稿。',
  safetySlot,
  actions,
  onBodyChange,
  onSubmit,
}: LetterEditorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>写信编辑器</CardTitle>
            <CardDescription>线程 ID：{draft.threadId}</CardDescription>
          </div>
          <SaveStatus status={saveStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Textarea
            label="信件正文"
            value={draft.body}
            helperText={helperText}
            onChange={(event) => onBodyChange?.(event.target.value)}
          />
          {safetySlot}
          <div className="flex flex-wrap gap-3">
            {onSubmit ? <Button onClick={onSubmit}>发送信件</Button> : null}
            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
