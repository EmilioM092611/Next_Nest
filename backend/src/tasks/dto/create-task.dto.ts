// backend/src/tasks/dto/create-task.dto.ts
export class CreateTaskDto {
  title!: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date;
  userId!: number;
  categoryId?: number;
}
