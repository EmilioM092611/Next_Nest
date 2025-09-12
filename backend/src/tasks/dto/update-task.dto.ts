// backend/src/tasks/dto/update-task.dto.ts
export class UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  categoryId?: number;
}
