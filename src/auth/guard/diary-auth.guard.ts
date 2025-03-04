import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { DiaryService } from 'src/diary/diary.service';

@Injectable()
export class DiaryGuard implements CanActivate {
  constructor(
    @Inject(DiaryService) private readonly diaryService: DiaryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const diaryId = parseInt(request.params.diaryId, 10);

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Allow doctors
    if (user.role === 'doctor') {
      return true;
    }

    // Allow patients only if they are accessing their own diary
    if (user.role === 'patient') {
      const diary = await this.diaryService.findById(diaryId);
      if (diary && diary.patientId === user.id) {
        return true;
      }
    }

    throw new ForbiddenException('Access denied');
  }
}
