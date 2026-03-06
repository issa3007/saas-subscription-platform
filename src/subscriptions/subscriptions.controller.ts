import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  getSubscription(@Req() req: any) {
    return this.subscriptionsService.getCompanySubscription(req.user.companyId);
  }

  @Patch('change-plan')
  changePlan(
    @Req() req: any,
    @Body() body: { plan: 'free' | 'basic' | 'premium' },
  ) {
    return this.subscriptionsService.changePlan(req.user.companyId, body.plan);
  }
}
