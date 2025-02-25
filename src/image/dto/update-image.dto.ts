import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateImageDto {
  @IsOptional()
  @IsInt()
  label?: number;

  @IsOptional()
  @IsString()
  type?: string; // File type (e.g., 'jpg', 'png')
}
