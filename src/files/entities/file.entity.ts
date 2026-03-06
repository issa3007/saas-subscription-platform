import { Company } from 'src/companies/entities/company.entity';
import { FileAccess } from 'src/files/entities/file.access.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('files')
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fileName: string;

  @Column()
  path: string;

  @Column({ type: 'enum', enum: ['all', 'restricted'] })
  visibility: 'all' | 'restricted';

  @ManyToOne(() => Company, (company) => company.files, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @ManyToOne(() => User)
  uploadedBy: User;

  @OneToMany(() => FileAccess, (fa) => fa.file)
  accessList: FileAccess[];

  @CreateDateColumn()
  createdAt: Date;
}
