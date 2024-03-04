import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../prisma-repository.service';

@Injectable()
export class TagService {

  constructor(private readonly prisma: PrismaRepository) {
  }

  getTop10Tags() {
    return this.prisma.tag.groupBy({
      by: ['tag'],
      // _count: {
      //   tag: true
      // },
      orderBy: {
        _count: {
          tag: 'desc'
        }
      },
      take: 10
    });
  }
}
