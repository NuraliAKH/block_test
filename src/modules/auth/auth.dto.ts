import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpDto {
  @IsPhoneNumber()
  contact: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  password: string;
}

export class SignInDto {
  @IsPhoneNumber()
  contact: string;

  @IsNotEmpty()
  password: string;
}
