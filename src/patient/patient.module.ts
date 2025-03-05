import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { HttpModule } from '@nestjs/axios';
import { EncryptionService } from 'src/encryption/encryption.service';

@Module({
  imports: [HttpModule],
  providers: [PatientService, EncryptionService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
