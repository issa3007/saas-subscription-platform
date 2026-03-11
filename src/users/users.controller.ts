import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InviteUserDto } from './dto/invite-user.dto';
import { ActivateUserDto } from './dto/activate-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users in company' })
  @ApiResponse({
    status: 200,
    description: 'List of company users',
  })
  getUsers(@Req() req: any) {
    return this.usersService.findCompanyUsers(req.user.companyId);
  }

  @Post('invite')
  @Roles('admin')
  @ApiOperation({ summary: 'Invite employee to company' })
  @ApiBody({ type: InviteUserDto })
  @ApiResponse({
    status: 201,
    description: 'Invitation sent',
  })
  inviteEmployee(@Req() req: any, @Body() dto: InviteUserDto) {
    return this.usersService.inviteEmployee(req.user.companyId, dto.email);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate invited user account' })
  @ApiBody({ type: ActivateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User account activated',
  })
  activateEmployee(@Body() dto: ActivateUserDto) {
    return this.usersService.activateEmployee(dto.token, dto.password);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remove employee from company' })
  @ApiParam({
    name: 'id',
    example: '5',
    description: 'User ID',
  })
  @ApiResponse({
    status: 200,
    description: 'User removed',
  })
  removeEmployee(@Req() req: any, @Param('id') id: string) {
    return this.usersService.removeEmployee(req.user.companyId, id);
  }
}
