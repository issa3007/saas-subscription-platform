import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../entities/plan.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Injectable()
export class PlansSeed implements OnModuleInit {
  private readonly context = 'PlansSeed';

  constructor(
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed(): Promise<void> {
    const count = await this.planRepo.count();

    if (count > 0) {
      this.logger.log('Plans already seeded', this.context);
      return;
    }

    await this.planRepo.save([
      {
        name: 'free',
        fileLimit: 10,
        userLimit: 1,
        basePrice: 0,
      },
      {
        name: 'basic',
        fileLimit: 100,
        userLimit: 10,
        basePrice: 0,
        perUserPrice: 5,
      },
      {
        name: 'premium',
        fileLimit: 1000,
        userLimit: -1,
        basePrice: 300,
        perFileOverLimitPrice: 0.5,
      },
    ]);

    this.logger.log('Plans seeded successfully', this.context);
  }
}
