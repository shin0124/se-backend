import { Controller, Get, Headers } from '@nestjs/common';
import { AppService } from './app.service';
import { EncryptionService } from './encryption/encryption.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly encryptionService: EncryptionService,
  ) {}

  @Get('getRole')
  getRole(@Headers('X-Role') encryptedRole: string): string {
    const role = this.encryptionService.decryptValue(encryptedRole);
    return role;
  }
}
