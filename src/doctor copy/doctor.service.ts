import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Doctor } from './doctor.entity';
import {
  RegisterDoctorDto,
  LoginDoctorDto,
  ChangePasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from './doctor.dto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async registerDoctor(data: RegisterDoctorDto) {
    const existingDoctor = await this.doctorRepository.findOne({
      where: { email: data.email },
    });
    if (existingDoctor) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const doctor = this.doctorRepository.create({
      ...data,
      password: hashedPassword,
    });
    await this.doctorRepository.save(doctor);

    return { message: 'Doctor registered successfully', doctor };
  }

  async loginDoctor(data: LoginDoctorDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { email: data.email },
    });
    if (!doctor || !(await bcrypt.compare(data.password, doctor.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      doctor: {
        id: doctor.id,
        email: doctor.email,
        name: `${doctor.firstName} ${doctor.lastName}`,
        specialization: doctor.specialization,
      },
    };
  }

  async sendOtp(data: SendOtpDto) {
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(data: VerifyOtpDto) {
    return { message: 'OTP verified successfully' };
  }

  async changePassword(data: ChangePasswordDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { email: data.email },
    });
    if (!doctor) throw new NotFoundException('Doctor not found');

    if (!(await bcrypt.compare(data.currentPassword, doctor.password))) {
      throw new BadRequestException('Current password is incorrect');
    }

    doctor.password = await bcrypt.hash(data.newPassword, 10);
    await this.doctorRepository.save(doctor);

    return { message: 'Password updated successfully' };
  }
}
