import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PatientAuthService } from '../../patientAuth/patientAuth.service';

@Injectable()
export class PatientLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private patientAuthService: PatientAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.patientAuthService.validatePatient(
      username,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
