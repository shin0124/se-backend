import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DoctorAuthService } from 'src/doctorAuth/doctorAuth.service';

@Injectable()
export class DoctorLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private doctorAuthService: DoctorAuthService) {
    super();
  }

  async validate(email: string, password: string): Promise<any> {
    const doctor = await this.doctorAuthService.validateDoctor(email, password);
    if (!doctor) {
      throw new UnauthorizedException();
    }
    return doctor;
  }
}
