// diary.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from './diary.entity';
import { PatientModule } from '../patient/patient.module';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary]), PatientModule, ImageModule], // Add PatientModule to imports
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
