import { Module } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { UserController } from './user.controller';
import { PrismaRepository } from '../prisma-repository.service';

@Module({
  controllers: [UserController],
  providers: [UsersService, PrismaRepository],
})
export class UserModule {}
