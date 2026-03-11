import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Google',
    description: 'Company name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'admin@google.com',
    description: 'Company admin email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Account password',
  })
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'USA',
    description: 'Company country',
  })
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    example: 'Technology',
    description: 'Company industry',
  })
  @IsNotEmpty()
  industry: string;
}
