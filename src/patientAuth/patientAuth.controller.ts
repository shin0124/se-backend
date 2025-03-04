import { Controller, Post, Body } from '@nestjs/common';
import { PatientAuthService } from './patientAuth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('patientAuth')
export class PatientAuthController {
  constructor(private patientAuthService: PatientAuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.patientAuthService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.patientAuthService.register(body);
  }
}
