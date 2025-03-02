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
  Req,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { JwtAuthGuard } from 'src/patientAuth/jwt-auth.guard';

@Controller('images')
@UseGuards(JwtAuthGuard)
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(private readonly imageService: ImageService) {}

  @Post(':diaryId')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(
    @Param('diaryId') diaryId: number,
    @UploadedFiles() files: (Express.Multer.File | string)[],
    @Req() req: any,
  ) {
    console.log(files);

    if (!files || files.length === 0) {
      throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadedImages = await this.imageService.uploadImages(
      diaryId,
      files,
      req.user.id,
    );

    return {
      message: 'Images uploaded successfully',
      data: uploadedImages,
    };
  }

  @Get(':diaryId')
  getImages(@Param('diaryId') diaryId: number, @Req() req: any) {
    const patientId = req.user.id;
    return this.imageService.getImages(diaryId, patientId);
  }
}
