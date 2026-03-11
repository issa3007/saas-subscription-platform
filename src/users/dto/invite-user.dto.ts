import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty({
    example: 'employee@company.com',
    description: 'Email of employee to invite',
  })
  @IsEmail()
  email: string;
}
