// diary.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { Diary } from './diary.entity';
import { PatientModule } from '../patient/patient.module';
import { ImageModule } from 'src/image/image.module';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { AuthModule } from 'src/patientAuth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diary]),
    PatientModule,
    ImageModule,
    MinioClientModule,
    AuthModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
