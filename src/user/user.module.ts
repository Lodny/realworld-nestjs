import { Module } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { UserController } from './user.controller';

@Module({
  providers: [UsersService],
  controllers: [UserController]
})
export class UserModule {}
