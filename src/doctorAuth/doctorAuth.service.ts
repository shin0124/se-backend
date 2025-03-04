import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ChangePasswordDto,
  LoginDoctorDto,
  RegisterDoctorDto,
  SendOtpDto,
  VerifyOtpDto,
} from './doctor.dto';

@Injectable()
export class DoctorAuthService {
  private readonly baseUrl = process.env.CLINIC_API_URL + '/doctor';

  constructor(
    private httpService: HttpService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateDoctor(email: string, pass: string): Promise<any> {
    try {
      const { data: doctor } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}?email=${email}`),
      );

      if (doctor && (await bcrypt.compare(pass, doctor.password))) {
        return doctor;
      }
    } catch (error) {
      console.error('Error validating doctor:', error.message);
    }
    return null;
  }

  async login(body: LoginDoctorDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/login`, body),
      );

      const payload = {
        doctorid: data.doctor.email,
        sub: data.doctor.password,
        userrole: 'doctor',
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error('Invalid credentials: ' + error);
    }
  }

  async register(body: RegisterDoctorDto) {
    try {
      const registerBody = { ...body, password: body.password }; // Create a new object with the hashed password

      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/register`, registerBody), // Use the new object
      );

      const payload = {
        doctorid: data.doctor.email,
        sub: data.doctor.password,
        userrole: 'doctor',
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error('Registration failed: ' + error);
    }
  }
  async sendOtp(data: SendOtpDto) {
    try {
      await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/send-otp`, data),
      );
      return { message: 'OTP sent successfully' };
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to send OTP',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyOtp(data: VerifyOtpDto) {
    try {
      const { data: response } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/verify-otp`, data),
      );
      return response;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'OTP verification failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changePassword(data: ChangePasswordDto) {
    try {
      const { data: response } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/change-password`, data),
      );
      return response;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Failed to change password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
