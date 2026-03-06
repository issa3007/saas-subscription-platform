import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { handleServiceError } from '../common/utils/database-error.handler';

@Injectable()
export class CompaniesService {
  private readonly context = 'CompaniesService';
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createCompany(
    name: string,
    email: string,
    password: string,
    country: string,
    industry: string,
    verificationToken: string,
  ): Promise<Company> {
    this.logger.log('Creating company', this.context);

    try {
      const existing = await this.companyRepo.findOne({
        where: { email },
      });

      if (existing) {
        throw new ConflictException('Company email already exists');
      }

      const company = this.companyRepo.create({
        name,
        email,
        password,
        country,
        industry,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 86400000),
      });

      return await this.companyRepo.save(company);
    } catch (error) {
      handleServiceError(error, 'creating company', this.logger, this.context);
    }
  }

  async findByEmail(email: string): Promise<Company | null> {
    try {
      return await this.companyRepo.findOne({
        where: { email },
      });
    } catch (error) {
      handleServiceError(
        error,
        'finding company by email',
        this.logger,
        this.context,
      );
    }
  }

  async findById(id: string): Promise<Company> {
    try {
      const company = await this.companyRepo.findOne({
        where: { id },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      return company;
    } catch (error) {
      handleServiceError(error, 'finding company', this.logger, this.context);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const company = await this.companyRepo.findOne({
      where: { emailVerificationToken: token },
    });

    if (!company) {
      throw new NotFoundException('Invalid verification token');
    }

    if (
      company.emailVerificationExpires &&
      company.emailVerificationExpires < new Date()
    ) {
      throw new ConflictException('Verification token expired');
    }

    company.isEmailVerified = true;
    company.emailVerificationToken = null;
    company.emailVerificationExpires = null;

    await this.companyRepo.save(company);
  }

  async updateCompany(
    companyId: string,
    data: Partial<Company>,
  ): Promise<Company> {
    const company = await this.findById(companyId);
    Object.assign(company, data);
    
    return this.companyRepo.save(company);
  }
}
