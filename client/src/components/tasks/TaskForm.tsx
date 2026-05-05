import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Task } from '../../types';
import type { TaskFormValues } from '../../hooks/useTasks';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface Props {
  initial?: Task;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  onCancel: () => void;
  submitting?: boolean;
}

export function TaskForm({ initial, onSubmit, onCancel, submitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      priority: initial?.priority ?? 'MEDIUM',
      dueDate: toDatetimeLocal(initial?.dueDate),
    },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      title: values.title,
      description: values.description ? values.description : null,
      priority: values.priority,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    });
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Title" {...register('title')} error={errors.title?.message} autoFocus />
      <Textarea
        label="Description"
        rows={3}
        {...register('description')}
        error={errors.description?.message}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select label="Priority" {...register('priority')} error={errors.priority?.message}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
        <Input
          label="Due date"
          type="datetime-local"
          {...register('dueDate')}
          error={errors.dueDate?.message}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {initial ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}
