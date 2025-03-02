import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { PatientAuthService } from './patientAuth.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RegisterDto } from '../auth/register.dto';

@Controller('patientAuth')
export class PatientAuthController {
  constructor(private patientAuthService: PatientAuthService) {}

  @Post('login')
  async login(@Body() body: RegisterDto) {
    return this.patientAuthService.login(body.username, body.password);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.patientAuthService.register(body.username, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('user/:id')
  async findOne(@Param('id') id: string) {
    return this.patientAuthService.findOne(id);
  }
}
