import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../prisma-repository.service';

@Injectable()
export class FavoriteService {

  constructor(private readonly prisma: PrismaRepository) {}

  async favoriteArticle(slug: string, loginUserId: number) {
    console.log('favorite.service::favoriteArticle(): loginUserId:', loginUserId);

    const foundArticle = await this.prisma.article.findUnique({
      where: {slug},
      include: this.getInclude(loginUserId)
    });
    console.log('favorite.service::favoriteArticle(): foundArticle:', foundArticle);

    if (loginUserId === foundArticle.authorId)
      return foundArticle;

    await this.prisma.favorite.create({
      data: {
        articleId: foundArticle.id,
        userId: loginUserId
      }
    });

    return this.prisma.article.findUnique({
      where: {slug},
      include: this.getInclude(loginUserId)
    });
  }

  async unfavoriteArticle(slug: string, loginUserId: number) {
    console.log('favorite.service::unfavoriteArticle(): loginUserId:', loginUserId);

    const foundArticle = await this.prisma.article.findUnique({
      where: {slug},
      include: this.getInclude(loginUserId)
    });
    console.log('favorite.service::unfavoriteArticle(): foundArticle:', foundArticle);

    if (loginUserId === foundArticle.authorId)
      return foundArticle;

    await this.prisma.favorite.delete({
      where: {
        articleId_userId: {
          articleId: foundArticle.id,
          userId: loginUserId
        }
      }
    });
    console.log('favorite.service::unfavoriteArticle(): delete:');

    return this.prisma.article.findUnique({
      where: {slug},
      include: this.getInclude(loginUserId)
    });
  }

  private getInclude(loginUserId: number) {
    return {
      tagList: true,
      author: {
        include: {
          follows: {
            where: { followerId: loginUserId }
          }
        }
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
