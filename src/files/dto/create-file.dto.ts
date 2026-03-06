import { IsOptional, IsEnum } from 'class-validator';

export class UploadFileDto {
  @IsOptional()
  @IsEnum(['all', 'restricted'])
  visibility?: 'all' | 'restricted';
}
