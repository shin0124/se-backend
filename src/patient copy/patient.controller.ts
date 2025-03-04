import { Controller, Post, Put, Body, Get, Query } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('api/patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async getPatientInfo(
    @Query('citizenID') citizenID?: string,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('HN') HN?: string,
  ) {
    let patient;

    if (citizenID) {
      patient = await this.patientService.findByCitizenID(citizenID);
    } else if (firstName && lastName) {
      patient = await this.patientService.findByName(firstName, lastName);
    } else if (HN) {
      patient = await this.patientService.findByHN(HN);
    }

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  @Post()
  async createPatient(@Body() createPatientDto: CreatePatientDto) {
    try {
      const newPatient =
        await this.patientService.createPatient(createPatientDto);
      return {
        message: 'Patient created successfully',
        patient: newPatient,
      };
    } catch (error) {
      return {
        error: 'Failed to create patient: ' + error,
      };
    }
  }

  @Post('login')
  async login(@Body() loginData: { citizenID: string; password: string }) {
    return this.patientService.login(loginData.citizenID, loginData.password);
  }

  @Put()
  async updatePatient(@Body() updatePatientDto: UpdatePatientDto) {
    try {
      const updatedPatient =
        await this.patientService.updatePatient(updatePatientDto);
      return {
        message: 'Patient updated successfully',
        patientUpdate: updatedPatient,
      };
    } catch (error) {
      return {
        error: 'Failed to update patient: ' + error,
      };
    }
  }

  @Post('changepassword')
  async changePassword(
    @Body()
    changePasswordData: {
      citizenID: string;
      currentPassword: string;
      newPassword: string;
    },
  ) {
    const response = await this.patientService.changePassword(
      changePasswordData.citizenID,
      changePasswordData.currentPassword,
      changePasswordData.newPassword,
    );

    if (response.error) {
      return { error: response.error };
    }

    return {
      message: 'Password updated successfully',
    };
  }
}
