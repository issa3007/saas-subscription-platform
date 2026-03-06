import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
import { FileAccess } from 'src/files/entities/file.access.entity';
// import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';

@Injectable()
export class FilesService {
  private readonly context = 'FilesService';

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    @InjectRepository(FileAccess)
    private readonly accessRepo: Repository<FileAccess>,
    // private readonly awsS3Service: AwsS3Service,
    private readonly subscriptionsService: SubscriptionsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  // async uploadFile(
  //   file: Express.Multer.File,
  //   companyId: string,
  //   userId: string,
  // ): Promise<FileEntity> {
  //   this.logger.log('Uploading file', this.context);

  //   await this.subscriptionsService.validateFileLimit(companyId);

  //   const url = await this.awsS3Service.uploadFile(file, companyId);

  //   const entity = this.fileRepo.create({
  //     fileName: file.originalname,
  //     path: url,
  //     company: { id: companyId },
  //     uploadedBy: { id: userId },
  //     visibility: 'all',
  //   });

  //   const saved = await this.fileRepo.save(entity);

  //   await this.subscriptionsService.incrementFileCount(companyId);

  //   return saved;
  // }

  async getCompanyFiles(companyId: string): Promise<FileEntity[]> {
    return this.fileRepo.find({
      where: { company: { id: companyId } },
      relations: ['uploadedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteFile(fileId: string, companyId: string): Promise<void> {
    const file = await this.fileRepo.findOne({
      where: { id: fileId, company: { id: companyId } },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.fileRepo.delete(file.id);
  }

  async changeVisibility(
    fileId: string,
    visibility: 'all' | 'restricted',
  ): Promise<FileEntity> {
    const file = await this.fileRepo.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.visibility = visibility;

    return this.fileRepo.save(file);
  }

  async setRestrictedAccess(fileId: string, userIds: string[]): Promise<void> {
    const file = await this.fileRepo.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.accessRepo.delete({ file: { id: fileId } });

    const accessList = userIds.map((userId) =>
      this.accessRepo.create({
        file: { id: fileId },
        user: { id: userId },
      }),
    );

    await this.accessRepo.save(accessList);
  }

  async checkFileAccess(fileId: string, userId: string): Promise<boolean> {
    const file = await this.fileRepo.findOne({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.visibility === 'all') {
      return true;
    }

    const access = await this.accessRepo.findOne({
      where: {
        file: { id: fileId },
        user: { id: userId },
      },
    });

    if (!access) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
