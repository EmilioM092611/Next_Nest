// backend/src/categories/entities/category.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 7, default: '#3B82F6' })
  color: string;

  @Column({ length: 50, nullable: true })
  icon: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Task, task => task.category)
  tasks: Task[];
}