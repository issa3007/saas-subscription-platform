import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { User } from './entities/user.entity';
import { Company } from '../companies/entities/company.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { handleServiceError } from '../common/utils/database-error.handler';

@Injectable()
export class UsersService {
  private readonly context = 'UsersService';
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly subscriptionsService: SubscriptionsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createAdmin(
    companyId: string,
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    this.logger.log('Creating admin user', this.context);

    try {
      const company = await this.companyRepo.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const admin = this.userRepo.create({
        email,
        password: hashedPassword,
        role: 'admin',
        isActive: false,
        company,
      });

      return await this.userRepo.save(admin);
    } catch (error) {
      handleServiceError(error, 'creating admin', this.logger, this.context);
    }
  }

  async inviteEmployee(companyId: string, email: string): Promise<User> {
    this.logger.log('Inviting employee', this.context);

    try {
      const existing = await this.userRepo.findOne({
        where: { email },
      });

      if (existing) {
        throw new ConflictException('User already exists');
      }

      const company = await this.companyRepo.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      await this.subscriptionsService.validateUserLimit(companyId);

      const token = crypto.randomUUID();

      const employee = this.userRepo.create({
        email,
        role: 'employee',
        isActive: false,
        invitationToken: token,
        invitationExpires: new Date(Date.now() + 86400000),
        company,
      });

      const saved = await this.userRepo.save(employee);

      await this.subscriptionsService.incrementUserCount(companyId);

      return saved;
    } catch (error) {
      handleServiceError(error, 'inviting employee', this.logger, this.context);
    }
  }

  async activateEmployee(token: string, password: string): Promise<void> {
    this.logger.log('Activating employee', this.context);

    try {
      const user = await this.userRepo
        .createQueryBuilder('user')
        .addSelect(['user.password', 'user.invitationToken'])
        .where('user.invitationToken = :token', { token })
        .getOne();

      if (!user) {
        throw new NotFoundException('Invalid activation token');
      }

      if (!user.invitationExpires || user.invitationExpires < new Date()) {
        throw new ConflictException('Invitation expired');
      }

      const hashed = await bcrypt.hash(password, 10);

      await this.userRepo.update(user.id, {
        password: hashed,
        isActive: true,
        invitationToken: null,
        invitationExpires: null,
      });
    } catch (error) {
      handleServiceError(
        error,
        'activating employee',
        this.logger,
        this.context,
      );
    }
  }

  async findCompanyUsers(companyId: string): Promise<User[]> {
    try {
      return await this.userRepo.find({
        where: { company: { id: companyId } },
        select: ['id', 'email', 'role', 'isActive', 'createdAt'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      handleServiceError(error, 'fetching users', this.logger, this.context);
    }
  }

  async removeEmployee(companyId: string, userId: string): Promise<void> {
    this.logger.log('Removing employee', this.context);

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId, company: { id: companyId } },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.role === 'admin') {
        throw new ConflictException('Cannot delete admin');
      }

      await this.userRepo.delete(user.id);
    } catch (error) {
      handleServiceError(error, 'removing employee', this.logger, this.context);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepo
        .createQueryBuilder('user')
        .addSelect('user.password')
        .leftJoinAndSelect('user.company', 'company')
        .where('user.email = :email', { email })
        .getOne();
    } catch (error) {
      handleServiceError(
        error,
        'finding user by email',
        this.logger,
        this.context,
      );
    }
  }
}
