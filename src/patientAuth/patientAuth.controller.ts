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
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './register.dto';

@Controller('patientAuth')
export class PatientAuthController {
  constructor(private patientAuthService: PatientAuthService) {}

  @UseGuards(LocalAuthGuard)
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
