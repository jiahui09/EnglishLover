import { Badge, type BadgeVariant } from '@/components/ui';

export type SaveStatusValue = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

export interface SaveStatusProps {
  status: SaveStatusValue;
  label?: string;
}

const statusMeta: Record<SaveStatusValue, { label: string; variant: BadgeVariant }> = {
  idle: { label: '未开始保存', variant: 'neutral' },
  saving: { label: '正在保存', variant: 'info' },
  saved: { label: '已保存', variant: 'success' },
  error: { label: '保存失败', variant: 'danger' },
  offline: { label: '离线待同步', variant: 'warning' },
};

export function SaveStatus({ status, label }: SaveStatusProps) {
  const meta = statusMeta[status];

  return (
    <span
      className="text-el-subtle inline-flex items-center gap-2 text-sm"
      role="status"
      aria-live="polite"
    >
      <Badge variant={meta.variant} size="sm">
        {label ?? meta.label}
      </Badge>
    </span>
  );
}
