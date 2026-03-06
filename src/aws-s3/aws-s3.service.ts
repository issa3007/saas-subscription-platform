// import {
//   Injectable,
//   BadRequestException,
//   PayloadTooLargeException,
//   UnsupportedMediaTypeException,
//   InternalServerErrorException,
// } from '@nestjs/common';

// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuid } from 'uuid';

// const ALLOWED_TYPES = [
//   'text/csv',
//   'application/vnd.ms-excel',
//   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
// ];

// const MAX_SIZE = 10 * 1024 * 1024;

// @Injectable()
// export class AwsS3Service {
//   private readonly bucket = process.env.AWS_BUCKET_NAME!;

//   private readonly s3 = new S3Client({
//     region: process.env.AWS_REGION!,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//     },
//   });

//   private validate(file: Express.Multer.File) {
//     if (!file) throw new BadRequestException('File required');

//     if (!ALLOWED_TYPES.includes(file.mimetype)) {
//       throw new UnsupportedMediaTypeException('Only csv/xls/xlsx allowed');
//     }

//     if (file.size > MAX_SIZE) {
//       throw new PayloadTooLargeException('File too large');
//     }
//   }

//   async uploadFile(
//     file: Express.Multer.File,
//     companyId: string,
//   ): Promise<string> {
//     this.validate(file);

//     const key = `files/${companyId}/${uuid()}-${file.originalname}`;

//     try {
//       const command = new PutObjectCommand({
//         Bucket: this.bucket,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read',
//       });

//       await this.s3.send(command);

//       return `https://${this.bucket}.s3.amazonaws.com/${key}`;
//     } catch {
//       throw new InternalServerErrorException('Upload failed');
//     }
//   }
// }
