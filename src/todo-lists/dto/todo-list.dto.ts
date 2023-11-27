import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class TodoListDto {
  @ApiProperty({ example: 'shopping' })
  @IsNotEmpty()
  @MaxLength(128, {
    message: 'Name is too long',
  })
  name: string;
}
