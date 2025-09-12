// backend/src/tasks/tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, Priority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Mapear el string del DTO al enum Priority
    let priorityEnum: Priority = Priority.MEDIUM;
    
    if (createTaskDto.priority) {
      switch(createTaskDto.priority) {
        case 'low':
          priorityEnum = Priority.LOW;
          break;
        case 'medium':
          priorityEnum = Priority.MEDIUM;
          break;
        case 'high':
          priorityEnum = Priority.HIGH;
          break;
      }
    }
    
    const taskData = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      priority: priorityEnum,
      dueDate: createTaskDto.dueDate,
      userId: createTaskDto.userId,
      categoryId: createTaskDto.categoryId
    };
    
    const task = this.tasksRepository.create(taskData);
    const savedTask = await this.tasksRepository.save(task);
    return savedTask as Task;
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      relations: ['user', 'category'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: number): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user', 'category']
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Mapear el string del DTO al enum Priority si existe
    const updateData: any = { ...updateTaskDto };
    if (updateTaskDto.priority) {
      switch(updateTaskDto.priority) {
        case 'low':
          updateData.priority = Priority.LOW;
          break;
        case 'medium':
          updateData.priority = Priority.MEDIUM;
          break;
        case 'high':
          updateData.priority = Priority.HIGH;
          break;
      }
    }
    
    await this.tasksRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async toggleComplete(id: number): Promise<Task> {
    const task = await this.findOne(id);
    task.completed = !task.completed;
    return await this.tasksRepository.save(task);
  }
}