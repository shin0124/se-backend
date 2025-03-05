import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

@Injectable()
export class EncryptionService {
  private readonly decryptionKey: string;

  constructor(private configService: ConfigService) {
    this.decryptionKey = this.configService.get<string>('DECRYPT_KEY');

    if (!this.decryptionKey) {
      throw new Error('DECRYPT_KEY is not set in environment variables');
    }
  }

  decryptValue(encryptedValue: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.decryptionKey);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) throw new Error('Invalid encrypted data or key');

      return decryptedText;
    } catch (error) {
      throw new Error('Decryption failed: ' + error.message);
    }
  }
}
