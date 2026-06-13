import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from './Button';
import { ToastContext, type ToastInput, type ToastMessage } from './ToastContext';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (toast: ToastInput) => {
      const id = crypto.randomUUID();
      const nextToast: ToastMessage = {
        id,
        title: toast.title,
        tone: toast.tone ?? 'info',
        ...(toast.description !== undefined ? { description: toast.description } : {}),
      };

      setToasts((current) => [...current, nextToast]);
      window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ notify, dismiss }), [dismiss, notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ReadonlyArray<ToastMessage>;
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="el-toast-viewport"
      role="status"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {toasts.map((toast) => (
        <article key={toast.id} className={`el-toast el-toast--${toast.tone}`}>
          <div>
            <h2 className="text-el-main m-0 text-sm font-bold">{toast.title}</h2>
            {toast.description ? (
              <p className="text-el-subtle mt-1 text-sm">{toast.description}</p>
            ) : null}
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => onDismiss(toast.id)}>
              关闭
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
