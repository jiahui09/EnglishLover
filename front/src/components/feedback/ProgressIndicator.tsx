export interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
}

export function ProgressIndicator({
  value,
  max = 100,
  label,
  showValue = true,
  tone = 'primary',
}: ProgressIndicatorProps) {
  const safeMax = Math.max(max, 1);
  const percent = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  return (
    <div className="grid gap-2">
      {label || showValue ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          {label ? <span className="text-el-main font-semibold">{label}</span> : <span />}
          {showValue ? <span className="text-el-subtle">{Math.round(percent)}%</span> : null}
        </div>
      ) : null}
      <progress
        className={`el-progress el-progress--${tone}`}
        value={Math.min(Math.max(value, 0), safeMax)}
        max={safeMax}
        aria-label={label}
      />
    </div>
  );
}
