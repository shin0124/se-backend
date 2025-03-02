import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Patient } from 'src/patient/patient.entity';

@Injectable()
export class PatientAuthService {
  constructor(
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validatePatient(id: string, pass: string): Promise<any> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
    });
    if (patient && (await bcrypt.compare(pass, patient.password))) {
      const { password, ...result } = patient;
      void password;
      return result;
    }
    return null;
  }

  async login(id: string, pass: string) {
    const payload = { patientid: id, sub: pass };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(id: string, pass: string) {
    const existingPatient = await this.patientsRepository.findOne({
      where: { id },
    });

    if (existingPatient) {
      throw new Error('Username already taken');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pass, saltRounds);
    const patient = this.patientsRepository.create({
      id,
      password: hashedPassword,
    });
    this.patientsRepository.save(patient);
    const payload = { patientid: id, sub: pass };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findOne(id: string): Promise<Patient | undefined> {
    return this.patientsRepository.findOne({ where: { id } });
  }
}
