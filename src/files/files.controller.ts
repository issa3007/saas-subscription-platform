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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SetAccessDto } from 'src/files/dto/set-access.dto';
import { UpdateVisibilityDto } from 'src/files/dto/update-visibility.dto';

@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all company files' })
  @ApiResponse({
    status: 200,
    description: 'List of company files',
  })
  getFiles(@Req() req: any) {
    return this.filesService.getCompanyFiles(req.user.companyId);
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
  //   return this.filesService.uploadFile(file, req.user.companyId, req.user.sub);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiParam({
    name: 'id',
    example: '10',
    description: 'File ID',
  })
  @ApiResponse({
    status: 200,
    description: 'File deleted',
  })
  deleteFile(@Req() req: any, @Param('id') id: string) {
    return this.filesService.deleteFile(id, req.user.companyId);
  }

  @Patch(':id/visibility')
  @ApiOperation({ summary: 'Change file visibility' })
  @ApiParam({
    name: 'id',
    example: '10',
  })
  @ApiBody({ type: UpdateVisibilityDto })
  changeVisibility(@Param('id') id: string, @Body() dto: UpdateVisibilityDto) {
    return this.filesService.changeVisibility(id, dto.visibility);
  }

  @Patch(':id/access')
  @ApiOperation({ summary: 'Set restricted access for file' })
  @ApiParam({
    name: 'id',
    example: '10',
  })
  @ApiBody({ type: SetAccessDto })
  setAccess(@Param('id') id: string, @Body() dto: SetAccessDto) {
    return this.filesService.setRestrictedAccess(id, dto.userIds);
  }
}
