import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendMailDto } from './dto/send-mail.dto';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test-verification')
  @ApiOperation({ summary: 'Send company verification email (test)' })
  @ApiBody({ type: SendMailDto })
  @ApiResponse({
    status: 200,
    description: 'Verification email logged',
  })
  async sendVerification(@Body() dto: SendMailDto) {
    await this.mailService.sendCompanyVerificationEmail(dto.email, dto.token);

    return { message: 'Verification email logged' };
  }

  @Post('test-invitation')
  @ApiOperation({ summary: 'Send employee invitation email (test)' })
  @ApiBody({ type: SendMailDto })
  @ApiResponse({
    status: 200,
    description: 'Invitation email logged',
  })
  async sendInvitation(@Body() dto: SendMailDto) {
    await this.mailService.sendEmployeeInvitationEmail(dto.email, dto.token);

    return { message: 'Invitation email logged' };
  }

  @Post('test-reset')
  @ApiOperation({ summary: 'Send password reset email (test)' })
  @ApiBody({ type: SendMailDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset email logged',
  })
  async sendReset(@Body() dto: SendMailDto) {
    await this.mailService.sendPasswordResetEmail(dto.email, dto.token);

    return { message: 'Reset email logged' };
  }
}
