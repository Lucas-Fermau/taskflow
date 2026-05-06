import { useState } from 'react';
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
import type { ListTasksFilters, Task } from '../types';

export function DashboardPage() {
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

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your tasks</h1>
          <Button onClick={() => setCreating(true)}>+ New task</Button>
        </div>

        <StatsCards />

        <TaskFilters filters={filters} onChange={setFilters} />

        <TaskList
          tasks={tasks}
          loading={isLoading}
          onToggle={handleToggle}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
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
