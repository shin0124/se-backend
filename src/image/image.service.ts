import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { Image } from './image.entity';
import { ImageRepository } from './image.repository';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { DiaryRepository } from '../diary/diary.repository';
import { AppMimeType, BufferedFile } from 'src/minio-client/file.model';
import * as path from 'path';

@Injectable()
export class ImageService {
  constructor(
    private readonly minioClientService: MinioClientService,
    private readonly imageRepository: ImageRepository,
    private readonly diaryRepository: DiaryRepository,
  ) {}

  async uploadImages(diaryId: number, files: (Express.Multer.File | string)[]) {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
    });

    if (!diary) {
      throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
    }

    const existingImages = await this.imageRepository.find({
      where: { diary: { id: diaryId } },
    });

    for (const image of existingImages) {
      await this.minioClientService.delete(
        `${image.id}.${image.type}`,
        `${diaryId}`,
      );
      await this.imageRepository.remove(image);
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file || typeof file === 'string') continue; // Skip if no file at this index

      const fileType = path.extname(file.originalname).substring(1);
      const label = path.basename(
        file.originalname,
        path.extname(file.originalname),
      );
      const pathKey = `${diaryId}`;

      const bufferedFile: BufferedFile = {
        originalname: file.originalname,
        buffer: file.buffer,
        mimetype: file.mimetype as AppMimeType,
        fieldname: file.fieldname,
        size: file.size,
        encoding: '',
      };

      const image = this.imageRepository.create({
        diary,
        label: label,
        type: fileType,
        createdAt: new Date(),
      });

      await this.imageRepository.save(image);

      await this.minioClientService.upload(
        bufferedFile,
        String(image.id),
        pathKey,
      );

      uploadedImages.push({
        id: image.id,
        label,
      });
    }

    return uploadedImages;
  }

  async createImage(
    createImageDto: CreateImageDto,
    file: Express.Multer.File,
  ): Promise<Image> {
    const diary = await this.diaryRepository.findOne({
      where: { id: createImageDto.diaryId },
    });

    if (!diary) {
      throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
    }

    const { label } = createImageDto;
    const fileType = path.extname(file.originalname).substring(1); // Extract file extension
    const pathKey = `${diary.id}/${label}`;

    const bufferedFile: BufferedFile = {
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype as AppMimeType,
      fieldname: file.fieldname,
      size: file.size,
      encoding: '',
    };

    const image = this.imageRepository.create({
      diary,
      label: label,
      type: fileType, // Assign extracted file type
      createdAt: new Date(),
    });

    await this.imageRepository.save(image);

    await this.minioClientService.upload(
      bufferedFile,
      String(image.id),
      pathKey,
    );

    return image;
  }

  async updateImage(
    imageId: number,
    updateImageDto: UpdateImageDto,
  ): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId }, // Use `where` for options
    });

    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    // Merge the updated properties
    const updatedImage = Object.assign(image, updateImageDto);
    await this.imageRepository.save(updatedImage);

    return updatedImage;
  }

  async deleteImage(diaryId: number, label: string, imageId: number) {
    const image = await this.imageRepository.findOne({
      where: { diary: { id: diaryId }, label: label, id: imageId },
    });

    if (!image) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }

    try {
      // Delete file from MinIO
      await this.minioClientService.delete(
        `${imageId}.${image.type}`,
        `${diaryId}/${label}`,
      );

      // Delete image record from database
      await this.imageRepository.remove(image);

      return { message: 'Image deleted successfully' };
    } catch (err) {
      throw new HttpException(
        `Error deleting image from MinIO: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImages(diaryId: number) {
    const images = await this.imageRepository.find({
      where: { diary: { id: diaryId } },
    });

    if (images.length === 0) {
      throw new HttpException(
        'No images found for the given diary',
        HttpStatus.NOT_FOUND,
      );
    }

    // Map each image to its URL
    const imagesWithUrls = await Promise.all(
      images.map(async (image) => {
        const filePath = `${diaryId}/${image.id}.${image.type}`;
        const url = await this.minioClientService.getUrl(filePath);
        return {
          id: image.id,
          label: image.label,
          url,
        };
      }),
    );

    return imagesWithUrls;
  }
}
