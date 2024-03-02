import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaRepository } from '../prisma-repository.service';
import { AuthService } from '../auth/auth.service';
import { UserController } from '../user/user.controller';
import { ProfilesController } from '../profiles/profiles.controller';

@Module({
  controllers: [UsersController, UserController, ProfilesController],
  providers: [UsersService, PrismaRepository, AuthService],
  exports: [UsersService, PrismaRepository, AuthService],
})
export class UsersModule {}
