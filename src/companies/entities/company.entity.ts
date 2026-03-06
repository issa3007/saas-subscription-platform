import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';
import { FileEntity } from 'src/files/entities/file.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  country: string;

  @Column()
  industry: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  emailVerificationToken: string | null;
  
  @Column({
    type: 'datetime',
    nullable: true,
  })
  emailVerificationExpires: Date | null;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => FileEntity, (files) => files.company)
  files: FileEntity[];

  @OneToOne(() => Subscription, (subscription) => subscription.company)
  subscription: Subscription;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
