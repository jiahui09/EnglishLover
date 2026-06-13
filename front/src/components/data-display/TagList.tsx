import { Badge, type BadgeVariant } from '@/components/ui';

export type TagListItem = {
  id: string;
  label: string;
  tone?: BadgeVariant;
};

export interface TagListProps {
  tags: ReadonlyArray<TagListItem>;
  label?: string;
}

export function TagList({ tags, label = '标签列表' }: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {tags.map((tag) => (
        <li key={tag.id}>
          <Badge variant={tag.tone ?? 'neutral'}>{tag.label}</Badge>
        </li>
      ))}
    </ul>
  );
}
