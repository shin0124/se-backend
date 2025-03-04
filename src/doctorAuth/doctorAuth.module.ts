import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { DoctorAuthController } from './doctorAuth.controller';
import { DoctorAuthService } from './doctorAuth.service';
import { DoctorLocalStrategy } from 'src/auth/strategies/doctorLocal.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PassportModule, AuthModule, HttpModule, ConfigModule.forRoot()],
  controllers: [DoctorAuthController],
  providers: [DoctorAuthService, DoctorLocalStrategy],
  exports: [DoctorAuthService],
})
export class DoctorAuthModule {}
