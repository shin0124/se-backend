import { Controller, Post, Body } from '@nestjs/common';
import { DoctorAuthService } from './doctorAuth.service';
import {
  ChangePasswordDto,
  LoginDoctorDto,
  RegisterDoctorDto,
  SendOtpDto,
  VerifyOtpDto,
} from './doctor.dto';

@Controller('doctorAuth')
export class DoctorAuthController {
  constructor(private doctorAuthService: DoctorAuthService) {}

  @Post('login')
  async login(@Body() body: LoginDoctorDto) {
    return this.doctorAuthService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDoctorDto) {
    return this.doctorAuthService.register(body);
  }

  @Post('sendOTP')
  sendOtp(@Body() data: SendOtpDto) {
    return this.doctorAuthService.sendOtp(data);
  }

  @Post('verifyOTP')
  verifyOtp(@Body() data: VerifyOtpDto) {
    return this.doctorAuthService.verifyOtp(data);
  }

  @Post('changepassword')
  changePassword(@Body() data: ChangePasswordDto) {
    return this.doctorAuthService.changePassword(data);
  }
}
