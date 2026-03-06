import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailLog } from 'src/mail/entities/mail.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly context = 'MailService';
  constructor(
    @InjectRepository(MailLog)
    private readonly mailRepo: Repository<MailLog>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async sendCompanyVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const verificationLink = `http://localhost:3000/auth/verify-email?token=${token}`;

    const content = `
      Welcome!
      Please verify your company account by clicking the link below:
      ${verificationLink}
    `;

    await this.logMail(email, 'verification', content);
  }

  async sendEmployeeInvitationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const activationLink = `http://localhost:3000/auth/activate-employee?token=${token}`;

    const content = `
      You were invited to join a company.

      Activate your account here:

      ${activationLink}
    `;

    await this.logMail(email, 'invitation', content);
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`;

    const content = `
      Reset your password using the link below:
      ${resetLink}
    `;

    await this.logMail(email, 'reset', content);
  }

  private async logMail(
    to: string,
    type: 'verification' | 'invitation' | 'reset',
    content: string,
  ): Promise<void> {
    try {
      const log = this.mailRepo.create({
        to,
        subject: type,
        type,
        content,
        isSuccess: true,
      });

      await this.mailRepo.save(log);

      this.logger.log(`Mail logged: ${type} → ${to}`, this.context);
    } catch (error) {
      this.logger.error(`Mail failed: ${error.message}`, this.context);

      await this.mailRepo.save({
        to,
        subject: type,
        type,
        content,
        isSuccess: false,
        errorMessage: error.message,
      });
    }
  }
}
