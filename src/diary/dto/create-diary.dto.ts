import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDiaryDto {
  @IsInt()
  @IsNotEmpty()
  patientId: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  symptom: string;

  @IsInt()
  @IsNotEmpty()
  painScore: number;

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
