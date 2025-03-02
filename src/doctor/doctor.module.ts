import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor]), AuthModule],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
