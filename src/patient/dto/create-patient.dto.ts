import {
  IsString,
  IsNotEmpty,
  Length,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  citizenID: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 10)
  HN: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @IsEnum(['Male', 'Female', 'Other'])
  gender: string;

  @IsString()
  @Length(10, 10)
  birthDate: string;

  @IsString()
  address: string;

  @IsString()
  @Length(10, 10)
  phone: string;

  @IsString()
  @Length(8)
  password: string;
}
