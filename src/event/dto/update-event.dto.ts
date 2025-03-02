import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
  @IsNotEmpty()
  @IsString()
  event?: string;
}
