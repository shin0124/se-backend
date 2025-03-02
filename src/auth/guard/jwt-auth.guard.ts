import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: any) {
    // This will call the AuthGuard to handle the JWT validation
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new Error('Unauthorized');
    }
    return user;
  }
}
