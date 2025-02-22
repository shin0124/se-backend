import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  event?: string;
}
