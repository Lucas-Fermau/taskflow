import { Request, Response, NextFunction } from 'express';
import { tasksService } from '../services/tasks.service';
import {
  createTaskSchema,
  listTasksQuerySchema,
  updateTaskSchema,
} from '../schemas/tasks.schema';

export const tasksController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listTasksQuerySchema.parse(req.query);
      const tasks = await tasksService.list(req.userId!, query);
      res.json({ tasks });
    } catch (err) {
      next(err);
    }
  },

  async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await tasksService.stats(req.userId!);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createTaskSchema.parse(req.body);
      const task = await tasksService.create(req.userId!, data);
      res.status(201).json({ task });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateTaskSchema.parse(req.body);
      const task = await tasksService.update(req.userId!, req.params.id, data);
      res.json({ task });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await tasksService.remove(req.userId!, req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
