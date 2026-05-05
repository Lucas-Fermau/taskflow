import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import type { ListTasksFilters, Task, TaskStats } from '../types';

const tasksKey = (filters?: ListTasksFilters) => ['tasks', filters ?? {}] as const;
const statsKey = ['tasks', 'stats'] as const;

function buildQuery(filters?: ListTasksFilters): string {
  if (!filters) return '';
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.search) params.set('search', filters.search);
  if (filters.priority) params.set('priority', filters.priority);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function useTasks(filters: ListTasksFilters) {
  return useQuery({
    queryKey: tasksKey(filters),
    queryFn: () => apiFetch<{ tasks: Task[] }>(`/tasks${buildQuery(filters)}`),
    select: (data) => data.tasks,
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: statsKey,
    queryFn: () => apiFetch<TaskStats>('/tasks/stats'),
  });
}

export interface TaskFormValues {
  title: string;
  description?: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskFormValues) =>
      apiFetch<{ task: Task }>('/tasks', { method: 'POST', body: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<TaskFormValues> & { completed?: boolean };
    }) => apiFetch<{ task: Task }>(`/tasks/${id}`, { method: 'PATCH', body: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
