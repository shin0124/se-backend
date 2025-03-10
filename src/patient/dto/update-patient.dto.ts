import {
  IsString,
  IsNotEmpty,
  Length,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';

export class UpdatePatientDto {
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
