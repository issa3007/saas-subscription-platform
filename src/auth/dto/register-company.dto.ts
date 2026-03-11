import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCompanyDto {
  @ApiProperty({
    example: 'Google',
    description: 'Company name',
  })
  @IsString()
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
  @IsString()
  password: string;

  @ApiProperty({
    example: 'Georgia',
    description: 'Company country',
  })
  @IsString()
  country: string;

  @ApiProperty({
    example: 'Technology',
    description: 'Business industry',
  })
  @IsString()
  industry: string;
}
