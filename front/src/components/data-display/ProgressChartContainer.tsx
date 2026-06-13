import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface ProgressChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function ProgressChartContainer({
  title,
  description,
  children,
  footer,
}: ProgressChartContainerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="el-chart-frame" role="img" aria-label={title}>
          {children}
        </div>
        {footer ? <div className="text-el-subtle mt-4 text-sm">{footer}</div> : null}
      </CardContent>
    </Card>
  );
}
