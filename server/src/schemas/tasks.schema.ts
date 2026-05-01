import { z } from 'zod';

export const prioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  priority: prioritySchema.default('MEDIUM'),
  dueDate: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable()
    .or(z.literal('').transform(() => null)),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  completed: z.boolean().optional(),
});

export const listTasksQuerySchema = z.object({
  status: z.enum(['all', 'pending', 'completed']).default('all'),
  search: z.string().trim().optional(),
  priority: prioritySchema.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
