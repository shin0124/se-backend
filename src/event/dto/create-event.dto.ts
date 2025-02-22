import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsInt()
  patientId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  event: string;
}
