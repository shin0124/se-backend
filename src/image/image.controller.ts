import {
  Controller,
  Post,
  Param,
  UseInterceptors,
  Logger,
  Get,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { EncryptionService } from 'src/encryption/encryption.service';

@Controller('images')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(
    private readonly imageService: ImageService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Post(':diaryId')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Param('diaryId') diaryId: number,
    @UploadedFiles() files: (Express.Multer.File | string)[],
  ) {
    console.log('fuck');
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    if (!files || files.length === 0) {
      throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadedImages = await this.imageService.uploadImages(
      diaryId,
      files,
      citizenID,
    );

    return {
      message: 'Images uploaded successfully',
      data: uploadedImages,
    };
  }

  @Get(':diaryId')
  getImages(
    @Param('diaryId') diaryId: number,
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
  ) {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);
    return this.imageService.getImages(diaryId, citizenID, role);
  }
}
