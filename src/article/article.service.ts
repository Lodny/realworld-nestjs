import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { PrismaRepository } from '../prisma-repository.service';
import slugify from 'slugify';
import { QueryArticleDto } from './dto/query-article.dto';

@Injectable()
export class ArticleService {

  constructor(private readonly prisma: PrismaRepository) {
  }

  createArticle(createArticleDto: CreateArticleDto, loginUserId: number) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto
        , slug: slugify(createArticleDto.title, {lower: true})
        , authorId: loginUserId
        , tagList: {
          create: createArticleDto.tagList.map(tag => ({tag})),
        }
      },
      include: {
        tagList: true,
        author: true
      }
    });
  }

  getArticleBySlug(slug: string, loginUserId: number) {
    return this.prisma.article.findUnique({
      where: {slug},
      include: {
        tagList: true,
        author: {
          include: {
            follows: {
              where: {followerId: loginUserId || -1}
            }
          },
        }
      }
    });
  }

  getArticles(query: QueryArticleDto, loginUserId: number) {
    console.log('article.service::getArticles(): loginUserId:', loginUserId);

    return this.prisma.article.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        tagList: true,
        author: {
          include: {
            follows: {
              where: {followerId: loginUserId || -1}
            }
          },
        }
      }
    });
  }
}
