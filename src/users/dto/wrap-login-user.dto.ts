import { LoginUserDto } from './login-user.dto';
import { ValidateNested } from 'class-validator';

export class WrapLoginUserDto {
  @ValidateNested()
  user: LoginUserDto;
}
