import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('mail_logs')
export class MailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
  })
  to: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  subject: string;

  @Column({
    type: 'enum',
    enum: ['verification', 'invitation', 'reset'],
  })
  type: 'verification' | 'invitation' | 'reset';

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  isSuccess: boolean;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  errorMessage: string | null;

  @CreateDateColumn({
    type: 'datetime',
  })
  sentAt: Date;
}
