import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

@Entity('billing_cycles')
export class BillingCycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => Company, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @Column()
  month: number;

  @Column()
  year: number;

  @Column({ default: 0 })
  fileCount: number;

  @Column({ default: 0 })
  userCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  calculatedAmount: number;

  @Column({ default: false })
  isClosed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
