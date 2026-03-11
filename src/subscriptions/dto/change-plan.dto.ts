import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ChangePlanDto {
  @ApiProperty({
    example: 'basic',
    description: 'Subscription plan name',
  })
  @IsEnum(['free', 'basic', 'premium'])
  plan: 'free' | 'basic' | 'premium';
}
