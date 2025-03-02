import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { DoctorAuthService } from './doctorAuth.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RegisterDto } from './register.dto';

@Controller('doctorAuth')
export class DoctorAuthController {
  constructor(private doctorAuthService: DoctorAuthService) {}

  @Post('login')
  async login(@Body() body: RegisterDto) {
    return this.doctorAuthService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.doctorAuthService.register(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    return this.doctorAuthService.findOne(id);
  }
}
