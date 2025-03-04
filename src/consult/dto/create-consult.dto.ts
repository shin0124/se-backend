import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateConsultDto {
  @IsNumber()
  @IsNotEmpty()
  patientId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
