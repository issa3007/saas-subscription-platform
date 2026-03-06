import { IsEnum } from 'class-validator';

export class ChangePlanDto {
  @IsEnum(['free', 'basic', 'premium'])
  plan: 'free' | 'basic' | 'premium';
}
