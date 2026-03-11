import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BillingResponseDto } from './dto/billing-response.dto';

@ApiTags('Billing')
@ApiBearerAuth()
@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  @ApiOperation({ summary: 'Get current billing information for company' })
  @ApiResponse({
    status: 200,
    description: 'Billing information returned successfully',
    type: BillingResponseDto,
  })
  getBilling(@Req() req: any) {
    return this.billingService.getCurrentBilling(req.user.companyId);
  }
}
