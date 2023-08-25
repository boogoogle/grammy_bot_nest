import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  tgUsername?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

export class RegisterUserDto {
  @IsString()
  @IsOptional()
  tgUsername?: string;

  @IsString()
  @IsOptional()
  tgAccount?: string;
}
