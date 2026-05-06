import { Pencil, Trash2, Calendar, Flag, Check } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Task } from '../../types';

const priorityStyles = {
  LOW: {
    pill: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    accent: 'bg-slate-300 dark:bg-slate-600',
  },
  MEDIUM: {
    pill: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    accent: 'bg-amber-400',
  },
  HIGH: {
    pill: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
    accent: 'bg-red-500',
  },
};

const priorityLabel = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

function formatDueDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const due = formatDueDate(task.dueDate);
  const overdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const styles = priorityStyles[task.priority];

  return (
    <div
      className={cn(
        'group relative flex items-start gap-3 overflow-hidden rounded-xl border bg-white p-4 pl-5 transition-all duration-200 dark:bg-slate-900',
        task.completed
          ? 'border-slate-200/70 opacity-60 dark:border-slate-800/70'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:hover:border-slate-700'
      )}
    >
      {/* priority accent bar */}
      <div className={cn('absolute left-0 top-0 h-full w-1', styles.accent)} />

      <button
        onClick={() => onToggle(task)}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all',
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:scale-110 hover:border-brand-500 dark:border-slate-600'
        )}
      >
        {task.completed ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3
            className={cn(
              'font-medium tracking-tight',
              task.completed ? 'text-slate-500 line-through dark:text-slate-500' : ''
            )}
          >
            {task.title}
          </h3>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium',
              styles.pill
            )}
          >
            <Flag className="h-3 w-3" />
            {priorityLabel[task.priority]}
          </span>
          {due ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs',
                overdue
                  ? 'font-medium text-red-600 dark:text-red-400'
                  : 'text-slate-500 dark:text-slate-400'
              )}
            >
              <Calendar className="h-3 w-3" />
              {overdue ? `Overdue · ${due}` : due}
            </span>
          ) : null}
        </div>
        {task.description ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-0">
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Edit task"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
          aria-label="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
