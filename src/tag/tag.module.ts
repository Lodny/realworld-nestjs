import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { PrismaRepository } from '../prisma-repository.service';

@Module({
  controllers: [TagController],
  providers: [TagService, PrismaRepository],
})
export class TagModule {}
