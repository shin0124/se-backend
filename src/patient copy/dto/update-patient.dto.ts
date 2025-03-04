import { IsString, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  citizenID: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsString()
  @IsOptional()
  relationship?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  height?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  chronicDisease?: string;

  @IsString()
  @IsOptional()
  allergicFood?: string;

  @IsString()
  @IsOptional()
  allergicMedicine?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
