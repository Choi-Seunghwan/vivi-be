import { Body, Controller, Logger, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { StorageUploadDto } from './dto/storage-upload.dto';

@Controller('storage')
@UsePipes(ValidationPipe)
export class StorageController {
  logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}

  @Post('/upload')
  // @UseGuards(RolesAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() dto: StorageUploadDto) {
    try {
      const { path } = dto;
      const result = await this.storageService.uploadToS3(file, path);
      return result;
    } catch (e) {
      this.logger.error(e, { dto });
      throw e;
    }
  }
}
