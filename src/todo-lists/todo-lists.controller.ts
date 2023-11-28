import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
  Patch,
  Delete,
  SetMetadata,
  HttpException,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TodoListsService } from './todo-lists.service';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { CreateTodoListItemsDto } from './dto/create-todo-list-items.dto';
import { TodoList } from './entities/todo-list.entity';

import { TodoItem } from './entities/todo-item.entity';
import { UpdateTodoItemDto } from './dto/update-todo-item.dto';
import { TodoListAccessGuard } from './todo-list-access.guard';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { GetPagination } from '../utils/decorators/pagination.decorator';
import { infinityPagination } from '../utils/infinity-pagination';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';

@ApiBearerAuth()
@SetMetadata('todoListIdField', 'id')
@UseGuards(AuthGuard('jwt'))
@ApiTags('TodoLists')
@Controller({
  path: 'todo-lists',
  version: '1',
})
export class TodoListsController {
  constructor(private readonly todoListsService: TodoListsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTodoList(
    @Request() req,
    @Body() createTodoListDto: CreateTodoListDto,
  ): Promise<TodoList> {
    return this.todoListsService.createTodoList({
      ...createTodoListDto,
      userId: req.user.id,
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getTodoLists(
    @Request() req,
    @GetPagination() pagination,
  ): Promise<InfinityPaginationResultType<TodoList>> {
    return infinityPagination(
      await this.todoListsService.getTodoLists(req.user.id, pagination),
      pagination,
    );
  }

  @UseGuards(TodoListAccessGuard)
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  updateTodoList(
    @Param('id') id: TodoList['id'],
    @Body() payload: UpdateTodoListDto,
  ): Promise<TodoList> {
    const todoList = this.todoListsService.updateTodoListById(id, payload);
    if (!todoList)
      throw new HttpException(
        "Todo list doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    return todoList;
  }

  @UseGuards(TodoListAccessGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTodoList(@Request() req, @Param('id') id: TodoList['id']) {
    await this.todoListsService.softDeleteTodoList(id);
  }

  @UseGuards(TodoListAccessGuard)
  @Post('/:id/items')
  @HttpCode(HttpStatus.CREATED)
  createTodoListItems(
    @Request() req,
    @Param('id') todoList: TodoList['id'],
    @Body() itemsDto: CreateTodoListItemsDto,
  ): Promise<TodoItem[]> {
    const todos = itemsDto.items.map((todo) => ({
      ...todo,
      todoList,
    }));
    return this.todoListsService.createItems(todos);
  }

  @UseGuards(TodoListAccessGuard)
  @Patch('/:id/items/:itemId')
  @HttpCode(HttpStatus.OK)
  async updateTodoListItem(
    @Request() req,
    @Param('itemId') itemId: TodoItem['id'],
    @Body() payload: UpdateTodoItemDto,
  ) {
    const todoItem = await this.todoListsService.updateTodoItemById(
      itemId,
      payload,
    );
    if (!todoItem)
      throw new HttpException("Todo doesn't exist", HttpStatus.BAD_REQUEST);
    return todoItem;
  }

  @UseGuards(TodoListAccessGuard)
  @Delete('/:id/items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTodoItem(
    @Request() req,
    @Param('itemId') itemId: TodoItem['id'],
  ) {
    await this.todoListsService.softDeleteTodoItem(itemId);
  }
}
