import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('me')
  getCompany(@Req() req: any) {
    return this.companiesService.findById(req.user.companyId);
  }

  @Patch('me')
  updateCompany(@Req() req: any, @Body() body: any) {
    return this.companiesService.updateCompany(req.user.companyId, body);
  }
}
