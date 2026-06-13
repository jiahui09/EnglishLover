import { Badge, type BadgeVariant } from '@/components/ui';
import { cn } from '@/lib/cn';

export type StepStatus = 'complete' | 'current' | 'pending' | 'blocked';

export type StepIndicatorItem = {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
};

export interface StepIndicatorProps {
  steps: ReadonlyArray<StepIndicatorItem>;
  orientation?: 'horizontal' | 'vertical';
}

const statusBadge: Record<StepStatus, BadgeVariant> = {
  complete: 'success',
  current: 'info',
  pending: 'neutral',
  blocked: 'warning',
};

export function StepIndicator({ steps, orientation = 'horizontal' }: StepIndicatorProps) {
  return (
    <ol
      className={cn(
        'el-step-indicator',
        orientation === 'vertical' && 'el-step-indicator--vertical',
      )}
    >
      {steps.map((step, index) => (
        <li key={step.id} className="el-step-indicator__item">
          <span className="el-step-indicator__index" aria-hidden="true">
            {index + 1}
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="text-el-main font-bold">{step.label}</span>
              <Badge variant={statusBadge[step.status]} size="sm">
                {step.status}
              </Badge>
            </span>
            {step.description ? (
              <span className="text-el-subtle mt-1 block text-sm">{step.description}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
