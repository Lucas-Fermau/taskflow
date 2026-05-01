import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { authenticate } from '../middleware/auth';

export const tasksRouter = Router();

tasksRouter.use(authenticate);

tasksRouter.get('/', tasksController.list);
tasksRouter.get('/stats', tasksController.stats);
tasksRouter.post('/', tasksController.create);
tasksRouter.patch('/:id', tasksController.update);
tasksRouter.delete('/:id', tasksController.remove);
