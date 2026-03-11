import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAccessDto {
  @ApiProperty({
    example: ['3', '7'],
    description: 'User IDs that can access the file',
  })
  @IsArray()
  userIds: string[];
}
