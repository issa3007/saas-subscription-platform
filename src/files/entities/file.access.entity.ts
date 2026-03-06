import { FileEntity } from 'src/files/entities/file.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_access')
export class FileAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FileEntity)
  file: FileEntity;

  @ManyToOne(() => User)
  user: User;
}
