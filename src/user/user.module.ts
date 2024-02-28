import { Module } from '@nestjs/common';
import { UsersService } from "../users/users.service";
import { UserController } from './user.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UserController],
  providers: [UsersService, PrismaService],
})
export class UserModule {}
