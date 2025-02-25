import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consult } from './consult/consult.entity';
import { Diary } from './diary/diary.entity';
import { Patient } from './patient/patient.entity';
import { Image } from './image/image.entity';
import { Event } from './event/event.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultModule } from './consult/consult.module';
import { DiaryModule } from './diary/diary.module';
import { PatientModule } from './patient/patient.module';
import { ImageModule } from './image/image.module';
import { EventModule } from './event/event.module';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Patient, Diary, Image, Consult, Event],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    PatientModule,
    DiaryModule,
    ImageModule,
    ConsultModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
