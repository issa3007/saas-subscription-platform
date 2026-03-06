import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Injectable()
export class BillingService {
  private readonly context = 'BillingService';

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getCurrentBilling(companyId: string) {
    this.logger.log('Calculating billing', this.context);

    const subscription = await this.subscriptionRepo.findOne({
      where: { company: { id: companyId } },
      relations: ['plan'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    const plan = subscription.plan;

    let total = 0;

    if (plan.name === 'free') {
      total = 0;
    }

    if (plan.name === 'basic') {
      total = subscription.currentUserCount * (plan.perUserPrice ?? 0);
    }

    if (plan.name === 'premium') {
      total = plan.basePrice;

      if (subscription.currentFileCount > plan.fileLimit) {
        const extra = subscription.currentFileCount - plan.fileLimit;

        total += extra * (plan.perFileOverLimitPrice ?? 0);
      }
    }

    return {
      plan: plan.name,
      users: subscription.currentUserCount,
      files: subscription.currentFileCount,
      total,
    };
  }
}
