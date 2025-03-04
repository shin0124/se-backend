import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  Length,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  citizenID: string;

  @IsString()
  @IsNotEmpty()
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
  @IsNotEmpty()
  gender: string;

  @IsString()
  @Length(10, 10)
  birthDate: string;

  @IsString()
  @Length(0, 100)
  @IsOptional()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @Length(10, 10)
  @IsOptional()
  emergencyContact: string;

  @IsString()
  @Length(0, 50)
  @IsOptional()
  relationship: string;

  @IsString()
  @Length(0, 10)
  @IsOptional()
  bloodType: string;

  @IsString()
  @Length(0, 50)
  @IsOptional()
  occupation: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  height: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  weight: number;

  @IsString()
  @Length(0, 50)
  @IsOptional()
  chronicDisease: string;

  @IsString()
  @Length(0, 50)
  @IsOptional()
  allergicFood: string;

  @IsString()
  @Length(0, 50)
  @IsOptional()
  allergicMedicine: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  imageUrl: string;
}
