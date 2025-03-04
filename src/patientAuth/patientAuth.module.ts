import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PatientAuthService } from './patientAuth.service';
import { PatientAuthController } from './patientAuth.controller';
import { ConfigModule } from '@nestjs/config';
import { PatientLocalStrategy } from '../auth/strategies/patientLocal.strategy';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PassportModule, AuthModule, ConfigModule.forRoot(), HttpModule],
  controllers: [PatientAuthController],
  providers: [PatientAuthService, PatientLocalStrategy],
  exports: [PatientAuthService],
})
export class PatientAuthModule {}
