import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Doctor } from 'src/doctor/doctor.entity';

@Injectable()
export class DoctorAuthService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateDoctor(email: string, pass: string): Promise<any> {
    const doctor = await this.doctorsRepository.findOne({
      where: { email },
    });
    if (doctor && (await bcrypt.compare(pass, doctor.password))) {
      const { password, ...result } = doctor;
      void password;
      return result;
    }
    return null;
  }

  async login(email: string, pass: string) {
    const payload = { doctoremail: email, sub: pass, userrole: 'doctor' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(email: string, pass: string) {
    const existingDoctor = await this.doctorsRepository.findOne({
      where: { email },
    });

    if (existingDoctor) {
      throw new Error('Email already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);
    const doctor = this.doctorsRepository.create({
      email,
      password: hashedPassword,
    });
    this.doctorsRepository.save(doctor);
    const payload = { doctoremail: email, sub: pass, userrole: 'doctor' };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findOne(email: string): Promise<Doctor | undefined> {
    return this.doctorsRepository.findOne({ where: { email } });
  }
}
