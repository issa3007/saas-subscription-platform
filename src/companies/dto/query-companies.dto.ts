import { IsOptional, IsNumberString } from 'class-validator';

export class QueryCompaniesDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}