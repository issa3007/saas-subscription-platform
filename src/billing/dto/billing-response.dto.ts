import { ApiProperty } from '@nestjs/swagger';

export class BillingResponseDto {
  @ApiProperty({
    example: 'basic',
    description: 'Current subscription plan',
  })
  plan: string;

  @ApiProperty({
    example: 10,
    description: 'Monthly price',
  })
  price: number;

  @ApiProperty({
    example: '2026-04-01',
    description: 'Next billing date',
  })
  nextBillingDate: string;

  @ApiProperty({
    example: 'active',
    description: 'Subscription status',
  })
  status: string;
}
