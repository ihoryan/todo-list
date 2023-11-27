import { ApiProperty } from '@nestjs/swagger';
import { TodoItemStatusEnum } from '../todo-item-status.enum';
import { IsEnum, IsOptional } from 'class-validator';
export class UpdateTodoItemDto {
  @ApiProperty({ example: 'Buy Bread' })
  @IsOptional()
  title?: string;

  @ApiProperty({ enum: TodoItemStatusEnum })
  @IsOptional()
  @IsEnum(TodoItemStatusEnum, {
    message: 'Unknown status',
  })
  status?: TodoItemStatusEnum;
}
