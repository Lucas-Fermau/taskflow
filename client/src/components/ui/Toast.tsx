import { useToasts } from '../../hooks/useToast';
import { cn } from '../../utils/cn';

const variantStyles = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-900 text-white dark:bg-slate-700',
};

export function ToastViewport() {
  const { toasts, dismiss } = useToasts();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={cn(
            'pointer-events-auto rounded-md px-4 py-3 text-sm shadow-lg transition-opacity',
            variantStyles[t.variant]
          )}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
