import { IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export class CreateFoodImageDto {
  @IsInt()
  @IsNotEmpty()
  diaryId: number;

  @IsEnum([0, 1, 2]) // 0: breakfast, 1: lunch, 2: dinner
  mealType: number;
}
