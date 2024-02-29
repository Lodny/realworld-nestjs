import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaRepository } from '../prisma-repository.service';
import { ProfilesController } from './profiles.controller';

@Module({
  controllers: [ProfilesController],
  providers: [UsersService, PrismaRepository],
})
export class ProfilesModule {}
