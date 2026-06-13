import { Badge, type BadgeVariant } from '@/components/ui';

export type TimelineItem = {
  id: string;
  title: string;
  description?: string;
  time?: string;
  tone?: BadgeVariant;
};

export interface TimelineProps {
  items: ReadonlyArray<TimelineItem>;
  ariaLabel?: string;
}

export function Timeline({ items, ariaLabel = '时间线' }: TimelineProps) {
  return (
    <ol className="el-timeline" aria-label={ariaLabel}>
      {items.map((item) => (
        <li key={item.id} className="el-timeline__item">
          <span className="el-timeline__dot" aria-hidden="true" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-el-main m-0 font-bold">{item.title}</h3>
              {item.time ? (
                <Badge variant={item.tone ?? 'neutral'} size="sm">
                  {item.time}
                </Badge>
              ) : null}
            </div>
            {item.description ? (
              <p className="text-el-subtle mt-1 text-sm">{item.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
