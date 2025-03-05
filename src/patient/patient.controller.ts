import {
  Controller,
  Get,
  Patch,
  Headers,
  Body,
  ForbiddenException,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { EncryptionService } from 'src/encryption/encryption.service';

@Controller('patients')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Get()
  findAll(
    @Headers('X-Role') encryptedRole: string,
    @Headers('X-Token') token: string,
  ) {
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'doctor') {
      throw new ForbiddenException('Access denied');
    }

    return this.patientService.findAll(token);
  }

  @Get('profile')
  findOne(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Headers('X-Token') token: string,
  ) {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.patientService.findOneByCitizenID(citizenID, token);
  }

  @Patch('update')
  update(
    @Headers('X-Citizen-ID') encryptedCitizenID: string,
    @Headers('X-Role') encryptedRole: string,
    @Headers('X-Token') token: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    const citizenID = this.encryptionService.decryptValue(encryptedCitizenID);
    const role = this.encryptionService.decryptValue(encryptedRole);

    if (role !== 'patient') {
      throw new ForbiddenException('Access denied');
    }

    return this.patientService.update(citizenID, updatePatientDto, token);
  }
}
