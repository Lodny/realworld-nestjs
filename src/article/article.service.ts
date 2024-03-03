import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaRepository } from '../prisma-repository.service';
import slugify from 'slugify';

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
    })
  }

  findAll(loginUserId: number) {
    return `This action returns all article`;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
