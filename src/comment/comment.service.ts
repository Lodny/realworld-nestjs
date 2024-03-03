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
      include: {
        author: {
          include: {
            follows: {
              where: { followerId: loginUserId }
            }
          }
        }
      }
    })
  }

  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
