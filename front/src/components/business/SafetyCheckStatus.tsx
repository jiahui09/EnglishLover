import type { ErrorCode } from './api-types';
import { InlineAlert } from '@/components/feedback';
import { Badge } from '@/components/ui';

export type SafetyCheckState = 'idle' | 'checking' | 'passed' | 'blocked' | 'needs_review';

const stateLabel: Record<SafetyCheckState, string> = {
  idle: '未检查',
  checking: '检查中',
  passed: '已通过',
  blocked: '已拦截',
  needs_review: '需复核',
};

export interface SafetyCheckStatusProps {
  state: SafetyCheckState;
  errorCode?: ErrorCode;
  description?: string;
}

export function SafetyCheckStatus({ state, errorCode, description }: SafetyCheckStatusProps) {
  const tone = state === 'passed' ? 'success' : state === 'blocked' ? 'danger' : state === 'needs_review' ? 'warning' : 'info';

  return (
    <InlineAlert tone={tone} title="安全检查状态">
      <div className="flex flex-wrap gap-2">
        <Badge variant={tone === 'danger' ? 'danger' : tone === 'warning' ? 'warning' : tone === 'success' ? 'success' : 'info'}>
          {stateLabel[state]}
        </Badge>
        {errorCode ? <Badge variant="danger">{errorCode}</Badge> : null}
      </div>
      {description ? <p className="mt-2">{description}</p> : null}
    </InlineAlert>
  );
}
