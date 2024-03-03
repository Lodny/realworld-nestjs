import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty({
    message: 'password : 필수 입니다.'
  })
  @IsString()
  password: string;
}
