import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaRepository } from '../prisma-repository.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaRepository],
})
export class UsersModule {}
