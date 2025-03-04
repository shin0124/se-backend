import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  citizenID: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
