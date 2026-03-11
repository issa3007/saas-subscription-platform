import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FileVisibility } from './upload-file.dto';

export class UpdateVisibilityDto {
  @ApiProperty({
    example: 'restricted',
    enum: FileVisibility,
  })
  @IsEnum(FileVisibility)
  visibility: FileVisibility;
}
