import { createContext } from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

export type ToastInput = Omit<ToastMessage, 'id' | 'tone'> & {
  tone?: ToastTone;
};

export type ToastContextValue = {
  notify: (toast: ToastInput) => void;
  dismiss: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
