import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PlanName {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
}

export class ChangePlanDto {
  @ApiProperty({
    example: PlanName.BASIC,
    enum: PlanName,
    description: 'Subscription plan name',
  })
  @IsEnum(PlanName)
  plan: PlanName;
}
