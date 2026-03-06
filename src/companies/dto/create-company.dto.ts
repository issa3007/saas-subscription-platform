import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  industry: string;
}
