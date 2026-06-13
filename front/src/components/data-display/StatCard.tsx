import type { ReactNode } from 'react';

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type BadgeVariant,
} from '@/components/ui';

export interface StatCardProps {
  label: string;
  value: ReactNode;
  description?: string;
  tone?: BadgeVariant;
  trendLabel?: string;
}

export function StatCard({
  label,
  value,
  description,
  tone = 'neutral',
  trendLabel,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{label}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {trendLabel ? <Badge variant={tone}>{trendLabel}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-el-main text-3xl font-black tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}
