import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import { EntityHelper } from '../../utils/entity-helper';
import { User } from '../../users/entities/user.entity';
import { TodoItem } from './todo-item.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class TodoList extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  name?: string;

  @ManyToOne(() => User)
  @Index()
  user: User;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  userId: number;

  @OneToMany(() => TodoItem, (todoItem) => todoItem.todoList, { eager: true })
  todoItems: TodoItem[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  nullCheck() {
    if (!this.todoItems) this.todoItems = [];
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude({ toPlainOnly: true })
  deletedAt: Date;
}
