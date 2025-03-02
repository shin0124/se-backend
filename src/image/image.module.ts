import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { Diary } from '../diary/diary.entity';
import { DiaryRepository } from 'src/diary/diary.repository';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { AuthModule } from 'src/auth/auth.module';
import { DiaryModule } from 'src/diary/diary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    MinioClientModule,
    AuthModule,
    forwardRef(() => DiaryModule),
  ],
  controllers: [ImageController],
  providers: [ImageService, DiaryRepository],
  exports: [ImageService],
})
export class ImageModule {}
