import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { MailService } from '../mail/mail.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly context = 'AuthService';
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async register(dto: any) {
    this.logger.log('Registering company', this.context);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomUUID();

    const company = await this.companiesService.createCompany(
      dto.name,
      dto.email,
      hashedPassword,
      dto.country,
      dto.industry,
      verificationToken,
    );

    const admin = await this.usersService.createAdmin(
      company.id,
      dto.email,
      hashedPassword,
    );

    await this.subscriptionsService.createFreeSubscription(company.id);

    await this.mailService.sendCompanyVerificationEmail(
      dto.email,
      verificationToken,
    );

    return {
      message: 'Company registered. Check email for verification.',
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account not activated');
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      role: user.role,
      companyId: user.company.id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }
}
