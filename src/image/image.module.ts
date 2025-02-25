import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Diary } from '../diary/diary.entity';
import { DiaryRepository } from 'src/diary/diary.repository';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Diary]), MinioClientModule],
  controllers: [ImageController],
  providers: [ImageService, ImageRepository, DiaryRepository], // Register both repositories
  exports: [ImageService],
})
export class ImageModule {}
