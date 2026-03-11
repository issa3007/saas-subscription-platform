import { IsOptional, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCompaniesDto {
  @ApiPropertyOptional({
    example: 'google',
    description: 'Search company by name',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Items per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
