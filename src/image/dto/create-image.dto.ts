import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @IsInt()
  @IsNotEmpty()
  diaryId: number;

  @IsString()
  @IsNotEmpty()
  label: string;
}
