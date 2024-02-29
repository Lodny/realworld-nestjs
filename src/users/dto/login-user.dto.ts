import { CreateUserDto } from './create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class LoginUserDto extends PartialType(CreateUserDto) {}
// export class LoginUserDto extends PartialType(OmitType(CreateUserDto, ['email'])) {}
