import type { KeyboardEvent, ReactNode } from 'react';
import { useId, useMemo, useState } from 'react';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};

export interface TabsProps {
  items: ReadonlyArray<TabItem>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
}

export function Tabs({ items, value, defaultValue, onValueChange, label = '选项卡' }: TabsProps) {
  const generatedId = useId();
  const firstEnabledItem = useMemo(() => items.find((item) => !item.disabled), [items]);
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabledItem?.id ?? '');
  const selectedValue = value ?? internalValue;
  const selectedItem = items.find((item) => item.id === selectedValue) ?? firstEnabledItem;

  const selectTab = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }

    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const enabledItems = items.filter((item) => !item.disabled);
    const currentItem = items[currentIndex];
    const enabledIndex = enabledItems.findIndex((item) => item.id === currentItem?.id);
    const nextItem =
      enabledItems[(enabledIndex + direction + enabledItems.length) % enabledItems.length];

    if (nextItem) {
      selectTab(nextItem.id);
    }
  };

  return (
    <div>
      <div className="el-tabs__list" role="tablist" aria-label={label}>
        {items.map((item, index) => {
          const tabId = `${generatedId}-${item.id}-tab`;
          const panelId = `${generatedId}-${item.id}-panel`;

          return (
            <button
              key={item.id}
              id={tabId}
              className="el-tabs__tab"
              type="button"
              role="tab"
              aria-selected={selectedItem?.id === item.id}
              aria-controls={panelId}
              disabled={item.disabled}
              onClick={() => selectTab(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selectedItem ? (
        <div
          id={`${generatedId}-${selectedItem.id}-panel`}
          className="el-tabs__panel"
          role="tabpanel"
          aria-labelledby={`${generatedId}-${selectedItem.id}-tab`}
        >
          {selectedItem.content}
        </div>
      ) : null}
    </div>
  );
}
