import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { EventService } from 'src/event/event.service';

@Injectable()
export class PatientOwnEventGuard implements CanActivate {
  constructor(
    @Inject(EventService) private readonly eventService: EventService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const eventId = parseInt(request.params.eventId, 10);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Allow patients only if they are accessing their own event
    if (user.role === 'patient') {
      const event = await this.eventService.findOne(eventId);
      if (event && event.patient.id === user.id) {
        return true;
      }
    }

    throw new ForbiddenException('Access denied');
  }
}
