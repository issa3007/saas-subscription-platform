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

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(@Req() req: any) {
    return this.usersService.findCompanyUsers(req.user.companyId);
  }

  @Post('invite')
  @Roles('admin')
  inviteEmployee(@Req() req: any, @Body() dto: InviteUserDto) {
    return this.usersService.inviteEmployee(req.user.companyId, dto.email);
  }

  @Post('activate')
  activateEmployee(@Body() dto: ActivateUserDto) {
    return this.usersService.activateEmployee(dto.token, dto.password);
  }

  @Delete(':id')
  @Roles('admin')
  removeEmployee(@Req() req: any, @Param('id') id: string) {
    return this.usersService.removeEmployee(req.user.companyId, id);
  }
}
