import { TodoItem } from '../entities/todo-item.entity';
import { ArrayMinSize } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateTodoListItemsDto {
  @ArrayMinSize(1)
  @ApiProperty({
    type: [PickType<TodoItem, 'title'>],
    example: [{ title: 'Buy apples' }],
  })
  items: Pick<TodoItem, 'title'>[];
}
