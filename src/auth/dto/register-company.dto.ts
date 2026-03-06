import { IsEmail, IsString } from 'class-validator';

export class RegisterCompanyDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  country: string;

  @IsString()
  industry: string;
}
