import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateMessageDto {
  date(chatId: number, date: any) {
    throw new Error('Method not implemented.');
  }
  @IsInt()
  @IsOptional()
  chatId?: number;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  timestamp?: string;

  @IsInt()
  @IsOptional()
  replyTo?: number | null;
}
