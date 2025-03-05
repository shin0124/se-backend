import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class UpdateDiaryDto {
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

  @IsOptional()
  @IsNotEmpty({ each: true })
  @IsBoolean({ each: true })
  food?: boolean[];
}
