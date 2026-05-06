import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatsCards } from '../components/dashboard/StatsCards';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
  type TaskFormValues,
} from '../hooks/useTasks';
import { toast } from '../hooks/useToast';
import { ApiError } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import type { ListTasksFilters, Task } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ListTasksFilters>({ status: 'all' });
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: tasks = [], isLoading } = useTasks(filters);
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  const handleCreate = async (values: TaskFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      setCreating(false);
      toast.success('Task created');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not create task');
    }
  };

  const handleUpdate = async (values: TaskFormValues) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: editing.id, input: values });
      setEditing(null);
      toast.success('Task updated');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not update task');
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await updateMutation.mutateAsync({
        id: task.id,
        input: { completed: !task.completed },
      });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not update task');
    }
  };

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await deleteMutation.mutateAsync(task.id);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not delete task');
    }
  };

  const firstName = user?.name.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Hey, <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Here's what's on your plate today.
            </p>
          </div>
          <Button onClick={() => setCreating(true)} size="md">
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>

        <StatsCards />

        <div className="space-y-4">
          <TaskFilters filters={filters} onChange={setFilters} />
          <TaskList
            tasks={tasks}
            loading={isLoading}
            onToggle={handleToggle}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <Modal open={creating} onClose={() => setCreating(false)} title="New task">
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
          submitting={createMutation.isPending}
        />
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit task">
        {editing ? (
          <TaskForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitting={updateMutation.isPending}
          />
        ) : null}
      </Modal>
    </div>
  );
}
