import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoList } from './entities/todo-list.entity';
import { FindManyOptions, Repository, DeepPartial } from 'typeorm';
import { TodoItem } from './entities/todo-item.entity';
import { Pagination } from '../utils/types/pagination.type';

@Injectable()
export class TodoListsService {
  constructor(
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
    @InjectRepository(TodoItem)
    private todoItemRepository: Repository<TodoItem>,
  ) {}

  createTodoList(todoList: Partial<TodoList>): Promise<TodoList> {
    return this.todoListRepository.save(
      this.todoListRepository.create(todoList),
    );
  }

  getTodoLists(userId: TodoList['user']['id'], pagination: Pagination) {
    return this.todoListRepository.find({
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      where: {
        userId,
      },
    });
  }

  async updateTodoListById(
    id: TodoList['id'],
    payload: Partial<TodoList>,
  ): Promise<TodoList> {
    const {
      raw: [todoList],
    } = await this.todoListRepository
      .createQueryBuilder()
      .update(TodoList, payload)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute();
    return (todoList && this.todoListRepository.create(todoList)) || todoList;
  }

  softDeleteTodoList(id: TodoList['id']) {
    return this.todoListRepository.softDelete(id);
  }

  async createItems(todoItems: Pick<TodoItem, 'title' | 'todoList'>[]) {
    return this.todoItemRepository.save(
      todoItems.map((todo) => this.todoItemRepository.create(todo)),
    );
  }

  async updateTodoItemById(id: TodoItem['id'], payload: DeepPartial<TodoItem>) {
    const {
      raw: [todoItem],
    } = await this.todoItemRepository
      .createQueryBuilder()
      .update(TodoItem, payload)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute();
    return (todoItem && this.todoItemRepository.create(todoItem)) || todoItem;
  }

  softDeleteTodoItem(id: TodoItem['id']) {
    return this.todoItemRepository.softDelete(id);
  }

  async todoListExists(options: FindManyOptions<TodoList>) {
    return this.todoListRepository.exist(options);
  }
}
