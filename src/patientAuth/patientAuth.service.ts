import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class PatientAuthService {
  private readonly baseUrl = process.env.CLINIC_API_URL + '/patients';

  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validatePatient(citizenID: string, pass: string): Promise<any> {
    try {
      const { data: patient } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}?citizenID=${citizenID}`),
      );

      if (patient && (await bcrypt.compare(pass, patient.password))) {
        return patient;
      }
    } catch (error) {
      console.error('Error validating patient:', error.message);
    }
    return null;
  }

  async login(body: LoginDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/login`, body),
      );

      const payload = {
        patientid: data.patient.citizenID,
        sub: data.patient.password,
        userrole: 'patient',
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error('Invalid credentials: ' + error);
    }
  }

  async register(body: RegisterDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}`, body), // Use the new object
      );

      const payload = {
        patientid: data.patient.citizenID,
        sub: data.patient.password,
        userrole: 'patient',
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error('Registration failed: ' + error);
    }
  }
}
