import {
  Controller,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Logger,
  Delete,
  Get,
  Patch,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateImageDto as CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  private readonly logger = new Logger(ImageController.name);

  constructor(private readonly imageService: ImageService) {}

  @Post(':diaryId')
  @UseInterceptors(FilesInterceptor('images')) // 'images' is the field name for file array
  async uploadImages(
    @Param('diaryId') diaryId: number,
    @UploadedFiles() files: (Express.Multer.File | string)[],
  ) {
    console.log('Post File: ', files);

    if (!files || files.length === 0) {
      throw new HttpException('No images uploaded', HttpStatus.BAD_REQUEST);
    }

    const uploadedImages = await this.imageService.uploadImages(diaryId, files);

    return {
      message: 'Images uploaded successfully',
      data: uploadedImages,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createImage(
    @Body() createImageDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const image = await this.imageService.createImage(createImageDto, file);
      return image;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Patch(':id')
  async updateImage(
    @Param('id') id: number,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    try {
      const image = await this.imageService.updateImage(id, updateImageDto);
      return image;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  @Delete(':diaryId/:label/:imageId')
  async deleteImage(
    @Param('diaryId') diaryId: number,
    @Param('label') label: string,
    @Param('imageId') imageId: number,
  ) {
    return this.imageService.deleteImage(diaryId, label, imageId);
  }

  @Get(':diaryId')
  async getImages(@Param('diaryId') diaryId: number) {
    return this.imageService.getImages(diaryId);
  }
}
