import { cn } from '../../utils/cn';
import type { Task } from '../../types';

const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  MEDIUM: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  HIGH: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
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

  return (
    <div
      className={cn(
        'group flex items-start gap-3 rounded-lg border bg-white p-4 transition-colors dark:bg-slate-900',
        task.completed
          ? 'border-slate-200 opacity-70 dark:border-slate-800'
          : 'border-slate-200 dark:border-slate-800'
      )}
    >
      <button
        onClick={() => onToggle(task)}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
          task.completed
            ? 'border-emerald-500 bg-emerald-500 text-white'
            : 'border-slate-300 hover:border-brand-500 dark:border-slate-600'
        )}
      >
        {task.completed ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4L9 11.6l6.3-6.3a1 1 0 0 1 1.4 0Z" />
          </svg>
        ) : null}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={cn(
              'font-medium',
              task.completed ? 'line-through text-slate-500 dark:text-slate-500' : ''
            )}
          >
            {task.title}
          </h3>
          <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', priorityStyles[task.priority])}>
            {priorityLabel[task.priority]}
          </span>
          {due ? (
            <span
              className={cn(
                'text-xs',
                overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
              )}
            >
              {overdue ? 'Overdue · ' : ''}
              {due}
            </span>
          ) : null}
        </div>
        {task.description ? (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(task)}
          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          aria-label="Edit task"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M14.7 2.3a2 2 0 0 1 2.8 2.8l-9 9-3.5.7.7-3.5 9-9Z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task)}
          className="rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
          aria-label="Delete task"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M6 2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 5H4a1 1 0 0 1 0-2h4V2Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
