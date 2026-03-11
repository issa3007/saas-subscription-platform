import { Controller, Get, Patch, Body, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current company profile' })
  @ApiResponse({
    status: 200,
    description: 'Company profile returned successfully',
  })
  getCompany(@Req() req: any) {
    return this.companiesService.findById(req.user.companyId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current company profile' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
  })
  updateCompany(@Req() req: any, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.updateCompany(req.user.companyId, dto);
  }
}
