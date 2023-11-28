import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TodoListsService } from './todo-lists.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class TodoListAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private todoListService: TodoListsService,
  ) {}

  canActivate(context: ExecutionContext) {
    const todoListIdField = this.reflector.getAllAndOverride<string>(
      'todoListIdField',
      [context.getClass(), context.getHandler()],
    );
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const todoListId = request.params[todoListIdField];
    return this.todoListService.todoListExists({
      where: {
        userId,
        id: todoListId,
      },
    });
  }
}
