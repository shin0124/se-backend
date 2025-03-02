import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDoctorDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
