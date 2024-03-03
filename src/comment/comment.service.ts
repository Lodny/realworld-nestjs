import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import * as console from 'console';
import { PrismaRepository } from '../prisma-repository.service';

@Injectable()
export class CommentService {

  constructor(private readonly prisma: PrismaRepository) {}

  async registerComment(slug: string, createCommentDto: CreateCommentDto, loginUserId: number) {
    console.log('comment.service::registerComment(): loginUserId:', loginUserId);

    const foundArticle = await this.prisma.article.findUnique({where: {slug}});
    console.log('comment.service::registerComment(): foundArticle:', foundArticle);

    return this.prisma.comment.create({
      data: {
        ...createCommentDto
        , articleId: foundArticle.id
        , authorId: loginUserId
      },
      include: this.getInclude(loginUserId)
    })
  }

  async getComments(slug: string, loginUserId: number) {
    console.log('comment.service::getComments(): loginUserId:', loginUserId);

    const foundArticle = await this.prisma.article.findUnique({where: {slug}});
    console.log('comment.service::getComments(): foundArticle:', foundArticle);

    return this.prisma.comment.findMany({
      where: { articleId: foundArticle.id },
      orderBy: { createdAt: 'desc' },
      include: this.getInclude(loginUserId)
    })
  }

  private getInclude(followerId: number) {
    return {
      author: {
        include: {
          follows: {
            where: { followerId }
          }
        }
      }
    };
  }

  async deleteComment(slug: string, id: number, loginUserId: number) {
    console.log('comment.service::deleteComment(): loginUserId:', loginUserId);

    const foundArticle = await this.prisma.article.findUnique({where: {slug}});
    console.log('comment.service::deleteComment(): foundArticle:', foundArticle);

    //todo::check delete error
    return this.prisma.comment.delete({
      where: {
        id,
        articleId: foundArticle.id,
        authorId: loginUserId
      }
    });
  }
}
