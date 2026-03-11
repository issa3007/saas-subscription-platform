import { Controller, Get } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Plan } from './entities/plan.entity';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'List of available plans',
    type: Plan,
    isArray: true,
  })
  getPlans() {
    return this.plansService.findAll();
  }
}
