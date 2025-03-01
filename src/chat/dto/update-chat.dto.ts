import {
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class UpdateChatDto {
  @IsInt()
  @IsNotEmpty()
  id?: number;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  pinned?: boolean;
}
