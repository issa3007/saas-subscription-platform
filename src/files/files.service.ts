import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from './entities/file.entity';
// import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
import { FileAccess } from './entities/file.access.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { handleServiceError } from '../common/utils/database-error.handler';
import { FileVisibility } from 'src/files/dto/upload-file.dto';
// import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

@Injectable()
export class FilesService {
  private readonly context = 'FilesService';
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepo: Repository<FileEntity>,
    @InjectRepository(FileAccess)
    // private readonly subscriptionsService: SubscriptionsService,
    // private readonly awsS3Service: AwsS3Service,
    private readonly accessRepo: Repository<FileAccess>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  async getCompanyFiles(companyId: string): Promise<FileEntity[]> {
    this.logger.log('Fetching company files', this.context);

    try {
      return await this.fileRepo.find({
        where: { company: { id: companyId } },
        relations: ['uploadedBy'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      handleServiceError(
        error,
        'fetching company files',
        this.logger,
        this.context,
      );
    }
  }

  async changeVisibility(
    fileId: string,
    visibility: FileVisibility,
  ): Promise<FileEntity> {
    this.logger.log('Changing file visibility', this.context);

    try {
      const file = await this.fileRepo.findOne({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      file.visibility = visibility;

      return await this.fileRepo.save(file);
    } catch (error) {
      handleServiceError(
        error,
        'changing file visibility',
        this.logger,
        this.context,
      );
    }
  }

  async setRestrictedAccess(fileId: string, userIds: string[]): Promise<void> {
    this.logger.log('Setting restricted access', this.context);

    try {
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
    } catch (error) {
      handleServiceError(
        error,
        'setting restricted access',
        this.logger,
        this.context,
      );
    }
  }

  async checkFileAccess(fileId: string, userId: string): Promise<boolean> {
    this.logger.log('Checking file access', this.context);

    try {
      const file = await this.fileRepo.findOne({
        where: { id: fileId },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      if (file.visibility === FileVisibility.ALL) {
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
    } catch (error) {
      handleServiceError(
        error,
        'checking file access',
        this.logger,
        this.context,
      );
    }
  }

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
  //     visibility: FileVisibility,
  //   });
  //   const saved = await this.fileRepo.save(entity);

  //   await this.subscriptionsService.incrementFileCount(companyId);
  //   return saved;
  // }

  async deleteFile(fileId: string, companyId: string): Promise<void> {
    this.logger.log('Deleting file', this.context);

    try {
      const file = await this.fileRepo.findOne({
        where: { id: fileId, company: { id: companyId } },
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }

      await this.fileRepo.delete(file.id);
    } catch (error) {
      handleServiceError(error, 'deleting file', this.logger, this.context);
    }
  }
}
