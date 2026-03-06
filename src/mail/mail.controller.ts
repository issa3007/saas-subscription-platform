import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('test-verification')
  async sendVerification(@Body() body: { email: string; token: string }) {
    await this.mailService.sendCompanyVerificationEmail(body.email, body.token);
    return { message: 'Verification email logged' };
  }

  @Post('test-invitation')
  async sendInvitation(@Body() body: { email: string; token: string }) {
    await this.mailService.sendEmployeeInvitationEmail(body.email, body.token);
    return { message: 'Invitation email logged' };
  }

  @Post('test-reset')
  async sendReset(@Body() body: { email: string; token: string }) {
    await this.mailService.sendPasswordResetEmail(body.email, body.token);
    return { message: 'Reset email logged' };
  }
}
