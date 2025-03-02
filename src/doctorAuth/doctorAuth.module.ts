import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { Doctor } from 'src/doctor/doctor.entity';
import { DoctorAuthController } from './doctorAuth.controller';
import { DoctorAuthService } from './doctorAuth.service';
import { DoctorLocalStrategy } from 'src/auth/strategies/doctorLocal.strategy';

@Module({
  imports: [
    PassportModule,
    AuthModule,
    TypeOrmModule.forFeature([Doctor]),
    ConfigModule.forRoot(),
  ],
  controllers: [DoctorAuthController],
  providers: [DoctorAuthService, DoctorLocalStrategy],
  exports: [DoctorAuthService],
})
export class DoctorAuthModule {}
