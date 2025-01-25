import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSymtomPicDto {
  @IsString()
  @IsOptional()
  symptomPic?: string;

  @IsNumber()
  @IsNotEmpty()
  diaryId: number; // Important: Use diaryId, not diary
}
