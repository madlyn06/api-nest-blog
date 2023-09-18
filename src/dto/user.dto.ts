import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  status: number;
  refresh_token: string;
}
export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class FilterUserDto {
  page: string;
  limit: string;
}
