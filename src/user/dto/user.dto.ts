import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsOptional()
  tgUsername?: string;

  @IsString()
  @IsOptional()
  tgAccountId: number;
}

export class CreateUserDto {
  @IsString()
  @IsOptional()
  tgAccountId: number;
}
