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
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { PatientOwnDiaryGuard } from 'src/auth/guard/diary-patient-auth.guard';
import { DiaryGuard } from 'src/auth/guard/diary-auth.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(private readonly imageService: ImageService) {}

  @Post(':diaryId')
  @UseGuards(PatientOwnDiaryGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @Param('diaryId') diaryId: number,
    @UploadedFiles() files: (Express.Multer.File | string)[],
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadedImages = await this.imageService.uploadImages(diaryId, files);

    return {
      message: 'Images uploaded successfully',
      data: uploadedImages,
    };
  }

  @Get(':diaryId')
  @UseGuards(DiaryGuard)
  getImages(@Param('diaryId') diaryId: number) {
    return this.imageService.getImages(diaryId);
  }
}
