import { IsString, IsOptional } from 'class-validator';

export class UpdateConsultDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;
}
