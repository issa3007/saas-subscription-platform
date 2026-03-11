import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FileVisibility {
  ALL = 'all',
  RESTRICTED = 'restricted',
}

export class UploadFileDto {
  @ApiPropertyOptional({
    example: 'all',
    enum: FileVisibility,
    description: 'File visibility',
  })
  @IsOptional()
  @IsEnum(FileVisibility)
  visibility?: FileVisibility;
}
