import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PatientAuthService } from './patientAuth.service';
import { PatientAuthController } from './patientAuth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patient/patient.entity';
import { ConfigModule } from '@nestjs/config';
import { PatientLocalStrategy } from '../auth/strategies/patientLocal.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule,
    AuthModule,
    TypeOrmModule.forFeature([Patient]),
    ConfigModule.forRoot(),
  ],
  controllers: [PatientAuthController],
  providers: [PatientAuthService, PatientLocalStrategy],
  exports: [PatientAuthService],
})
export class PatientAuthModule {}
