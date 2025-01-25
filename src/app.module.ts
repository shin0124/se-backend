import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consult } from './consult/consult.entity';
import { Diary } from './diary/diary.entity';
import { Patient } from './patient/patient.entity';
import { SymtomPic } from './symtom-pic/symtom-pic.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultModule } from './consult/consult.module';
import { DiaryModule } from './diary/diary.module';
import { PatientModule } from './patient/patient.module';
import { SymtomPicModule } from './symtom-pic/symptom-pic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      // username: process.env.POSTGRES_USER || 'poll_user',
      // password: process.env.POSTGRES_PASSWORD || 'postgres',
      // database: process.env.POSTGRES_DB || 'postgres',
      username: 'poll_user',
      password: 'poll_password',
      database: 'poll_db',
      entities: [Patient, Diary, SymtomPic, Consult],
      // synchronize: process.env.NODE_ENV === 'development',
      synchronize: true,
    }),
    PatientModule,
    DiaryModule,
    SymtomPicModule,
    ConsultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
