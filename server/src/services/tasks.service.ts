import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { HttpError } from '../middleware/errorHandler';
import type {
  CreateTaskInput,
  UpdateTaskInput,
  ListTasksQuery,
} from '../schemas/tasks.schema';

export const tasksService = {
  async list(userId: string, query: ListTasksQuery) {
    const where: Prisma.TaskWhereInput = { userId };

    if (query.status === 'pending') where.completed = false;
    if (query.status === 'completed') where.completed = true;
    if (query.priority) where.priority = query.priority;
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    return prisma.task.findMany({
      where,
      orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }],
    });
  },

  async stats(userId: string) {
    const [total, completed, pending, overdue] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, completed: true } }),
      prisma.task.count({ where: { userId, completed: false } }),
      prisma.task.count({
        where: {
          userId,
          completed: false,
          dueDate: { lt: new Date() },
        },
      }),
    ]);
    return { total, completed, pending, overdue };
  },

  async create(userId: string, input: CreateTaskInput) {
    return prisma.task.create({
      data: {
        userId,
        title: input.title,
        description: input.description ?? null,
        priority: input.priority,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
      },
    });
  },

  async update(userId: string, taskId: string, input: UpdateTaskInput) {
    await this.assertOwnership(userId, taskId);

    const data: Prisma.TaskUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.priority !== undefined) data.priority = input.priority;
    if (input.completed !== undefined) data.completed = input.completed;
    if (input.dueDate !== undefined) {
      data.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    }

    return prisma.task.update({ where: { id: taskId }, data });
  },

  async remove(userId: string, taskId: string) {
    await this.assertOwnership(userId, taskId);
    await prisma.task.delete({ where: { id: taskId } });
  },

  async assertOwnership(userId: string, taskId: string) {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new HttpError(404, 'Task not found');
    if (task.userId !== userId) throw new HttpError(403, 'Forbidden');
    return task;
  },
};
