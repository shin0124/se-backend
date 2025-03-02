import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { MinioClientService } from '../minio-client/minio-client.service';
import { DiaryRepository } from '../diary/diary.repository';
import { AppMimeType, BufferedFile } from 'src/minio-client/file.model';
import * as path from 'path';

@Injectable()
export class ImageService {
  constructor(
    private readonly minioClientService: MinioClientService,
    private readonly diaryRepository: DiaryRepository,
  ) {}

  async uploadImages(
    diaryId: number,
    files: (Express.Multer.File | string)[],
    patientId,
  ) {
    const diary = await this.diaryRepository.findOne({
      where: { id: diaryId },
      relations: ['patient'],
    });

    if (!diary) {
      throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
    }

    if (patientId !== diary.patient.id) {
      throw new NotFoundException(
        "You are not authorized to access this patient's diary.",
      );
    }

    for (const file of files) {
      if (!file || typeof file === 'string') continue;

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

      await this.minioClientService.upload(bufferedFile, label, pathKey);
    }
  }

  async getImages(diaryId: number, patientId) {
    try {
      const diary = await this.diaryRepository.findOne({
        where: { id: diaryId },
        relations: ['patient'],
      });

      if (!diary) {
        throw new HttpException('Diary not found', HttpStatus.NOT_FOUND);
      }

      if (patientId !== diary.patient.id) {
        throw new NotFoundException(
          "You are not authorized to access this patient's diary.",
        );
      }

      const paths = await this.minioClientService.listFiles(`${diaryId}/`);

      const imagesWithUrls = await Promise.all(
        paths.map(async (path) => {
          const url = await this.minioClientService.getUrl(path);
          return {
            label: path
              .split('/')
              .pop()
              ?.replace(/\.[^/.]+$/, ''),
            url,
          };
        }),
      );

      return imagesWithUrls;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw new Error('Failed to fetch images');
    }
  }
}
