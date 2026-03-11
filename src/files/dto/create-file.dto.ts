import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class UploadFileDto {
  @ApiPropertyOptional({
    example: 'all',
    description: 'File visibility',
  })
  @IsOptional()
  @IsEnum(['all', 'restricted'])
  visibility?: 'all' | 'restricted';
}
