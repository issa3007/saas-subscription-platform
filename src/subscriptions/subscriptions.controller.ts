import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get current company subscription' })
  @ApiResponse({
    status: 200,
    description: 'Company subscription details',
  })
  getSubscription(@Req() req: any) {
    return this.subscriptionsService.getCompanySubscription(req.user.companyId);
  }

  @Patch('change-plan')
  @ApiOperation({ summary: 'Change company subscription plan' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan changed',
  })
  changePlan(
    @Req() req: any,
    @Body() body: { plan: 'free' | 'basic' | 'premium' },
  ) {
    return this.subscriptionsService.changePlan(req.user.companyId, body.plan);
  }
}
