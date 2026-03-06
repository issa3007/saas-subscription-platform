import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Subscription } from './entities/subscription.entity';
import { Company } from '../companies/entities/company.entity';
import { Plan } from '../plans/entities/plan.entity';
import { handleServiceError } from '../common/utils/database-error.handler';

@Injectable()
export class SubscriptionsService {
  private readonly context = 'SubscriptionsService';

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async createFreeSubscription(companyId: string): Promise<Subscription> {
    this.logger.log('Creating free subscription', this.context);

    try {
      const company = await this.companyRepo.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const freePlan = await this.planRepo.findOne({
        where: { name: 'free' },
      });

      if (!freePlan) {
        throw new NotFoundException('Free plan not found');
      }

      const subscription = this.subscriptionRepo.create({
        company,
        plan: freePlan,
        startedAt: new Date(),
      });

      return await this.subscriptionRepo.save(subscription);
    } catch (error) {
      handleServiceError(
        error,
        'creating free subscription',
        this.logger,
        this.context,
      );
    }
  }

  async getCompanySubscription(companyId: string): Promise<Subscription> {
    try {
      const subscription = await this.subscriptionRepo.findOne({
        where: { company: { id: companyId } },
        relations: ['plan'],
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      return subscription;
    } catch (error) {
      handleServiceError(
        error,
        'fetching subscription',
        this.logger,
        this.context,
      );
    }
  }

  async changePlan(
    companyId: string,
    planName: 'free' | 'basic' | 'premium',
  ): Promise<Subscription> {
    this.logger.log(`Changing plan to ${planName}`, this.context);

    try {
      const subscription = await this.getCompanySubscription(companyId);

      const newPlan = await this.planRepo.findOne({
        where: { name: planName },
      });

      if (!newPlan) {
        throw new NotFoundException('Plan not found');
      }

      subscription.plan = newPlan;
      subscription.startedAt = new Date();

      return await this.subscriptionRepo.save(subscription);
    } catch (error) {
      handleServiceError(
        error,
        'changing subscription plan',
        this.logger,
        this.context,
      );
    }
  }

  async validateUserLimit(companyId: string): Promise<void> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { company: { id: companyId } },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const plan = subscription.plan;

    if (plan.userLimit === -1) {
      return;
    }

    if (subscription.currentUserCount >= plan.userLimit) {
      throw new ForbiddenException('User limit reached for this plan');
    }
  }

  async validateFileLimit(companyId: string): Promise<void> {
    try {
      const subscription = await this.getCompanySubscription(companyId);

      const plan = subscription.plan;

      if (subscription.currentFileCount >= plan.fileLimit) {
        if (plan.name !== 'premium') {
          throw new ForbiddenException('File upload limit reached');
        }
      }
    } catch (error) {
      handleServiceError(
        error,
        'validating file limit',
        this.logger,
        this.context,
      );
    }
  }

  async incrementUserCount(companyId: string): Promise<void> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { company: { id: companyId } },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.currentUserCount += 1;

    await this.subscriptionRepo.save(subscription);
  }

  async incrementFileCount(companyId: string): Promise<void> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { company: { id: companyId } },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.currentFileCount += 1;

    await this.subscriptionRepo.save(subscription);
  }
}
