import { Company } from 'src/companies/entities/company.entity';
import { Plan } from 'src/plans/entities/plan.entity';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Company)
  @JoinColumn()
  company: Company;

  @ManyToOne(() => Plan)
  plan: Plan;

  @Column({ default: 0 })
  currentFileCount: number;

  @Column({ default: 1 })
  currentUserCount: number;

  @Column()
  startedAt: Date;
}
