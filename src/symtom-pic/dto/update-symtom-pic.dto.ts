import { IsString, IsOptional } from 'class-validator';

export class UpdateSymtomPicDto {
  @IsString()
  @IsOptional()
  symptomPic?: string;
}
