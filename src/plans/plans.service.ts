import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import { handleServiceError } from '../common/utils/database-error.handler';

@Injectable()
export class PlansService {
  private readonly context = 'PlansService';

  constructor(
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,

    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async findAll(): Promise<Plan[]> {
    this.logger.log('Fetching all plans', this.context);

    try {
      return await this.planRepo.find({
        order: { basePrice: 'ASC' },
      });
    } catch (error) {
      handleServiceError(error, 'fetching plans', this.logger, this.context);
    }
  }

  async findByName(name: 'free' | 'basic' | 'premium'): Promise<Plan> {
    this.logger.log(`Finding plan: ${name}`, this.context);

    try {
      const plan = await this.planRepo.findOne({
        where: { name },
      });

      if (!plan) {
        throw new NotFoundException(`Plan ${name} not found`);
      }

      return plan;
    } catch (error) {
      handleServiceError(error, 'finding plan', this.logger, this.context);
    }
  }
}
