// diary.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from './diary.entity';
import { PatientModule } from '../patient/patient.module'; // Import PatientModule
import { SymtomPicModule } from '../symtom-pic/symptom-pic.module';

@Module({
  imports: [TypeOrmModule.forFeature([Diary]), PatientModule, SymtomPicModule], // Add PatientModule to imports
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
