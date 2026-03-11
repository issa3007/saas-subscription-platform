import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMailDto {
  @ApiProperty({
    example: 'user@company.com',
    description: 'Recipient email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'random_token_123',
    description: 'Verification or reset token',
  })
  @IsString()
  token: string;
}
