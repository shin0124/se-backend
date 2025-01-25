import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  tel?: string;
}
