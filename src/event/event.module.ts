import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './event.entity';
import { PatientModule } from '../patient/patient.module';
import { AuthModule } from 'src/patientAuth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), PatientModule, AuthModule],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
