export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: number;
  completed: boolean;
  createdAt: number;
}
