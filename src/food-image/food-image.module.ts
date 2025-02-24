import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodImage } from './food-image.entity';
import { FoodImageRepository } from './food-image.repository'; // Import FoodImageRepository
import { FoodImageService } from './food-image.service';
import { FoodImageController } from './food-image.controller';
import { Diary } from '../diary/diary.entity'; //Import Diary entity
import { DiaryRepository } from 'src/diary/diary.repository';
import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoodImage, Diary]), MinioClientModule],
  controllers: [FoodImageController],
  providers: [FoodImageService, FoodImageRepository, DiaryRepository], // Register both repositories
  exports: [FoodImageService],
})
export class FoodImageModule {}
