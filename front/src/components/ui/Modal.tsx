import type { ReactNode } from 'react';
import { useEffect, useId } from 'react';

import { Button } from './Button';

export interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  onClose: () => void;
}

export function Modal({
  open,
  title,
  description,
  children,
  footer,
  closeLabel = '关闭',
  onClose,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="el-modal__backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="el-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="el-modal__header">
          <div>
            <h2 id={titleId} className="text-el-main m-0 text-xl leading-tight font-bold">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="text-el-subtle mt-2 text-sm">
                {description}
              </p>
            ) : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={closeLabel}>
            ×
          </Button>
        </header>
        <div className="el-modal__body">{children}</div>
        {footer ? <footer className="el-modal__footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
