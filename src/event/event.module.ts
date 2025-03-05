import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from './event.entity';
import { PatientModule } from '../patient/patient.module';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), PatientModule],
  controllers: [EventController],
  providers: [EventService, EncryptionService],
  exports: [EventService],
})
export class EventModule {}
