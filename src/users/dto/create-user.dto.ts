import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at leas 8 characters long' })
  passwordHash!: string;

  @IsOptional()
  @IsMongoId({ message: 'Format roleId tidak valid' })
  roleId?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
