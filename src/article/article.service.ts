import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { PrismaRepository } from '../prisma-repository.service';
import slugify from 'slugify';
import { QueryArticleDto } from './dto/query-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {

  constructor(private readonly prisma: PrismaRepository) {
  }

  registerArticle(createArticleDto: CreateArticleDto, loginUserId: number) {
    return this.prisma.article.create({
      data: {
        ...createArticleDto
        , slug: slugify(createArticleDto.title, {lower: true})
        , authorId: loginUserId
        , tagList: {
          create: createArticleDto.tagList.map(tag => ({tag})),
        }
      },
      include: this.getInclude(loginUserId)
    });
  }

  getArticleBySlug(slug: string, loginUserId: number) {
    return this.prisma.article.findUnique({
      where: {slug},
      include: this.getInclude(loginUserId),
    });
  }

  getArticles(query: QueryArticleDto, loginUserId: number) {
    console.log('article.service::getArticles(): loginUserId:', loginUserId);

    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: this.getInclude(loginUserId)
    });
  }

  async getFeedArticles(query: QueryArticleDto, loginUserId: number) {
    console.log('article.service::getFeedArticles(): loginUserId:', loginUserId);

    //todo::feed not implemented
    return this.prisma.article.findMany({
      where: {
        author: {}
      },
      orderBy: { createdAt: 'desc' },
      include: this.getInclude(loginUserId)
    });
  }

  async updateArticle(slug: string, updateArticleDto: UpdateArticleDto, loginUserId: number) {
    if (!updateArticleDto.title)
      delete updateArticleDto.title;
    else
      updateArticleDto['slug'] = slugify(updateArticleDto.title, {lower: true});

    if (!updateArticleDto.description)
      delete updateArticleDto.description;

    if (!updateArticleDto.body)
      delete updateArticleDto.body;

    //todo::check not found
    return this.prisma.article.update({
      where: { slug },
      data: updateArticleDto,
      include: this.getInclude(loginUserId)
    });
  }

  deleteArticle(slug: string, loginUserId: number) {
    console.log('article.service::deleteArticle(): loginUserId:', loginUserId);

    return this.prisma.article.delete({
      where: {
        slug,
        authorId: loginUserId
      }
    });
  }

  private getInclude(loginUserId: number) {
    return {
      tagList: true,
      author: {
        include: {
          follows: {
            where: {followerId: loginUserId}
          }
        },
      },
      favorites: {
        where: {
          userId: loginUserId,
        }
      },
      _count: {
        select: { favorites: true },
      },
    };
  }
}
