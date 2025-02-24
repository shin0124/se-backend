import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateFoodImageDto {
  @IsOptional()
  @IsInt()
  mealType?: number;

  @IsOptional()
  @IsString()
  type?: string; // File type (e.g., 'jpg', 'png')
}
