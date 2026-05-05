import { Select } from '../ui/Input';
import type { ListTasksFilters, TaskStatus, Priority } from '../../types';

interface Props {
  filters: ListTasksFilters;
  onChange: (next: ListTasksFilters) => void;
}

export function TaskFilters({ filters, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex-1">
        <input
          type="search"
          placeholder="Search by title..."
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <Select
        value={filters.status ?? 'all'}
        onChange={(e) => onChange({ ...filters, status: e.target.value as TaskStatus })}
        className="sm:w-40"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </Select>
      <Select
        value={filters.priority ?? ''}
        onChange={(e) =>
          onChange({
            ...filters,
            priority: (e.target.value || undefined) as Priority | undefined,
          })
        }
        className="sm:w-40"
      >
        <option value="">Any priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </Select>
    </div>
  );
}
