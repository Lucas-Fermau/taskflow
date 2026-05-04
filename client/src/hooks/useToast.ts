import { useCallback, useEffect, useState } from 'react';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

let nextId = 1;
const listeners = new Set<(toasts: Toast[]) => void>();
let store: Toast[] = [];

function publish() {
  for (const listener of listeners) listener(store);
}

export const toast = {
  show(message: string, variant: ToastVariant = 'info') {
    const id = nextId++;
    store = [...store, { id, message, variant }];
    publish();
    setTimeout(() => {
      store = store.filter((t) => t.id !== id);
      publish();
    }, 3500);
  },
  success: (msg: string) => toast.show(msg, 'success'),
  error: (msg: string) => toast.show(msg, 'error'),
  info: (msg: string) => toast.show(msg, 'info'),
};

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>(store);
  useEffect(() => {
    const listener = (next: Toast[]) => setToasts(next);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    store = store.filter((t) => t.id !== id);
    publish();
  }, []);

  return { toasts, dismiss };
}
