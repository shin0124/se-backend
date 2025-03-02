import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { DoctorRoleGuard } from 'src/auth/guard/doctor-auth.guard';
import { PatientRoleGuard } from 'src/auth/guard/patient-auth.guard';

@Controller('patients') // Renamed path to 'user/patients'
@UseGuards(JwtAuthGuard) // Ensure routes are protected by JWT
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // Get all patients for the logged-in user
  @Get()
  @UseGuards(DoctorRoleGuard)
  findAll() {
    return this.patientService.findAll(); // Pass the user ID to service
  }

  // Get a single patient for the logged-in user
  @Get('profile') // Changed path to 'profile'
  @UseGuards(PatientRoleGuard)
  findOne(@Req() req: any) {
    return this.patientService.findOne(req.user.id); // Use logged-in user's ID
  }

  // Update the patient's profile (for logged-in user)
  @Patch('update') // Changed path to 'update'
  @UseGuards(PatientRoleGuard)
  update(
    @Body() updatePatientDto: UpdatePatientDto,
    @Req() req: any, // Access logged-in user context
  ) {
    return this.patientService.update(req.user.id, updatePatientDto); // Pass user ID
  }

  // Delete the patient's profile (for logged-in user)
  @Delete('delete') // Changed path to 'delete'
  @UseGuards(PatientRoleGuard)
  remove(@Req() req: any) {
    return this.patientService.remove(req.user.id); // Pass user ID
  }
}
