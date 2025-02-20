import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpdateDiaryDto {
  @IsInt()
  @IsNotEmpty()
  patientId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  symptom?: string;

  @IsInt()
  @IsOptional()
  painScore?: number;

  @IsString()
  @IsOptional()
  breakfast?: string;

  @IsString()
  @IsOptional()
  breakfastPic?: string;

  @IsString()
  @IsOptional()
  lunch?: string;

  @IsString()
  @IsOptional()
  lunchPic?: string;

  @IsString()
  @IsOptional()
  dinner?: string;

  @IsString()
  @IsOptional()
  dinnerPic?: string;
}
