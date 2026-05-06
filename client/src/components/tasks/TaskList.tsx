import { Inbox } from 'lucide-react';
import type { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface Props {
  tasks: Task[];
  loading?: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, loading, onToggle, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/60"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/30">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-100 to-violet-100 dark:from-brand-500/15 dark:to-violet-500/15">
          <Inbox className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">No tasks here yet</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Click <span className="font-medium text-slate-700 dark:text-slate-300">"New task"</span> to add your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
