import { Company } from 'src/companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    select: false,
    nullable: true,
  })
  password: string | null;

  @Column({
    type: 'enum',
    enum: ['admin', 'employee'],
  })
  role: 'admin' | 'employee';

  @Column({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    select: false,
  })
  invitationToken: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  invitationExpires: Date | null;

  @ManyToOne(() => Company, (company) => company.users, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
