import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
