import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileAccess } from 'src/files/entities/file.access.entity';
import { FileEntity } from 'src/files/entities/file.entity';
// import { AwsModule } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileEntity, FileAccess]),
    SubscriptionsModule,
    // AwsModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
