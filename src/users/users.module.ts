import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaRepository } from '../prisma-repository.service';
import { AuthService } from '../auth/auth.service';
import { UserController } from '../user/user.controller';
import { ProfilesController } from '../profiles/profiles.controller';
import { FollowService } from '../follow/follow.service';

@Module({
  controllers: [UsersController, UserController, ProfilesController],
  providers: [UsersService, PrismaRepository, AuthService, FollowService],
  exports: [UsersService, PrismaRepository, AuthService, FollowService],
})
export class UsersModule {}
