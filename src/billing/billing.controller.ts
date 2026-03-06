import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  getBilling(@Req() req: any) {
    return this.billingService.getCurrentBilling(req.user.companyId);
  }
}
