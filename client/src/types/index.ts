export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskStatus = 'all' | 'pending' | 'completed';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ListTasksFilters {
  status?: TaskStatus;
  search?: string;
  priority?: Priority;
}
