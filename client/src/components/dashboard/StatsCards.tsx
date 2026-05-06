import { ListTodo, Clock, CheckCircle2, AlertTriangle, type LucideIcon } from 'lucide-react';
import { useTaskStats } from '../../hooks/useTasks';

const cards: Array<{
  key: 'total' | 'pending' | 'completed' | 'overdue';
  label: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}> = [
  {
    key: 'total',
    label: 'Total',
    icon: ListTodo,
    iconBg: 'bg-brand-100 dark:bg-brand-500/15',
    iconColor: 'text-brand-600 dark:text-brand-400',
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    iconBg: 'bg-amber-100 dark:bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    iconBg: 'bg-red-100 dark:bg-red-500/15',
    iconColor: 'text-red-600 dark:text-red-400',
  },
];

export function StatsCards() {
  const { data, isLoading } = useTaskStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="group rounded-xl border border-slate-200/70 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-800/70 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.label}
                </p>
                <p className="mt-1.5 text-2xl font-bold tracking-tight">
                  {isLoading ? (
                    <span className="inline-block h-7 w-10 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  ) : (
                    (data?.[card.key] ?? 0)
                  )}
                </p>
              </div>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}
              >
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
