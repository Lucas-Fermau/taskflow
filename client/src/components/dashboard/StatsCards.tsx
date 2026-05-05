import { useTaskStats } from '../../hooks/useTasks';

const cards: Array<{ key: 'total' | 'pending' | 'completed' | 'overdue'; label: string; tone: string }> = [
  { key: 'total', label: 'Total tasks', tone: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200' },
  { key: 'pending', label: 'Pending', tone: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200' },
  { key: 'completed', label: 'Completed', tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200' },
  { key: 'overdue', label: 'Overdue', tone: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200' },
];

export function StatsCards() {
  const { data, isLoading } = useTaskStats();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${card.tone}`}>
            {card.label}
          </div>
          <div className="mt-2 text-2xl font-semibold">
            {isLoading ? '…' : (data?.[card.key] ?? 0)}
          </div>
        </div>
      ))}
    </div>
  );
}
