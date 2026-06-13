import type { ReactNode } from 'react';

import { Badge } from '@/components/ui';

export interface SafetyHighlightProps {
  label: string;
  children: ReactNode;
}

export function SafetyHighlight({ label, children }: SafetyHighlightProps) {
  return (
    <mark className="rounded-tokenSm bg-el-warning/10 text-el-main border-el-warning inline-flex items-center gap-2 border px-2 py-1">
      <Badge variant="warning" size="sm">
        {label}
      </Badge>
      <span>{children}</span>
    </mark>
  );
}
