import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Correctly extract JWT from the header
      ignoreExpiration: false, // Don't ignore token expiration
      secretOrKey: process.env.JWT_SECRET, // Ensure this matches the key used during token creation
    });
  }

  async validate(payload: any) {
    return {
      id: payload.patientid,
      email: payload.doctoremail,
      role: payload.userrole,
    }; // Adjust this based on your payload structure
  }
}
