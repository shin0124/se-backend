import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('doctors') // Renamed path to 'user/doctors'
@UseGuards(JwtAuthGuard) // Ensure routes are protected by JWT
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // Get all doctors for the logged-in user
  @Get()
  findAll() {
    return this.doctorService.findAll(); // Pass the user ID to service
  }

  // Get a single doctor for the logged-in user
  @Get('profile') // Changed path to 'profile'
  findOne(@Req() req: any) {
    return this.doctorService.findOne(req.user.email); // Use logged-in user's ID
  }

  // Update the doctor's profile (for logged-in user)
  @Patch('update') // Changed path to 'update'
  update(
    @Body() updateDoctorDto: UpdateDoctorDto,
    @Req() req: any, // Access logged-in user context
  ) {
    return this.doctorService.update(req.user.email, updateDoctorDto); // Pass user ID
  }

  // Delete the doctor's profile (for logged-in user)
  @Delete('delete') // Changed path to 'delete'
  remove(@Req() req: any) {
    return this.doctorService.remove(req.user.email); // Pass user ID
  }
}
