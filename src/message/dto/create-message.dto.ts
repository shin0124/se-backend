import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string;

  @IsInt()
  @IsOptional()
  replyTo?: number | null;
}
