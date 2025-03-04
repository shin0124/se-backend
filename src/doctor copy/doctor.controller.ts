import { Controller, Post, Body } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import {
  RegisterDoctorDto,
  LoginDoctorDto,
  ChangePasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from './doctor.dto';

@Controller('api/doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('register')
  register(@Body() data: RegisterDoctorDto) {
    return this.doctorService.registerDoctor(data);
  }

  @Post('login')
  login(@Body() data: LoginDoctorDto) {
    return this.doctorService.loginDoctor(data);
  }

  @Post('sendOTP')
  sendOtp(@Body() data: SendOtpDto) {
    return this.doctorService.sendOtp(data);
  }

  @Post('verifyOTP')
  verifyOtp(@Body() data: VerifyOtpDto) {
    return this.doctorService.verifyOtp(data);
  }

  @Post('changepassword')
  changePassword(@Body() data: ChangePasswordDto) {
    return this.doctorService.changePassword(data);
  }
}
