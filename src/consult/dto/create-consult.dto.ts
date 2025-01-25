import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConsultDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
