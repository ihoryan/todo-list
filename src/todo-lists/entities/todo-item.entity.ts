import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { TodoItemStatusEnum } from '../todo-item-status.enum';
import { TodoList } from './todo-list.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity()
export class TodoItem extends EntityHelper {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'buy milk' })
  @Column({ type: String, nullable: true })
  title?: string;

  @ApiProperty({ enum: TodoItemStatusEnum })
  @Column({
    type: 'enum',
    enum: TodoItemStatusEnum,
    default: TodoItemStatusEnum.TODO,
  })
  status: TodoItemStatusEnum;

  @ManyToOne(() => TodoList, (todoList) => todoList.todoItems)
  @Exclude({ toPlainOnly: true })
  todoList: TodoList['id'];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}
