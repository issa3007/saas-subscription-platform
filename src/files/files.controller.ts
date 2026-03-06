import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Req,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
  //   return this.filesService.uploadFile(file, req.user.companyId, req.user.sub);
  // }

  @Get()
  getFiles(@Req() req: any) {
    return this.filesService.getCompanyFiles(req.user.companyId);
  }

  @Delete(':id')
  deleteFile(@Req() req: any, @Param('id') id: string) {
    return this.filesService.deleteFile(id, req.user.companyId);
  }

  @Patch(':id/visibility')
  changeVisibility(@Param('id') id: string, @Body() body: any) {
    return this.filesService.changeVisibility(id, body.visibility);
  }

  @Patch(':id/access')
  setAccess(@Param('id') id: string, @Body() body: { userIds: string[] }) {
    return this.filesService.setRestrictedAccess(id, body.userIds);
  }
}
