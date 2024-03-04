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

    await this.prisma.favorite.create({
      data: {
        articleId: foundArticle.id,
        userId: loginUserId
      }
    });

    return {...foundArticle, favorites: [1]};
  }

  async unfavoriteArticle(slug: string, loginUserId: number) {
    console.log('favorite.service::unfavoriteArticle(): loginUserId:', loginUserId);

    const foundArticle = await this.prisma.article.findUnique({
      where: {slug},
      include: this.getInclude(loginUserId)
    });
    console.log('favorite.service::unfavoriteArticle(): foundArticle:', foundArticle);

    await this.prisma.favorite.delete({
      where: {
        articleId_userId: {
          articleId: foundArticle.id,
          userId: loginUserId
        }
      }
    });

    return {...foundArticle, favorites: [1]};
  }

  private getInclude(loginUserId: number) {
    return {
      author: {
        include: {
          follows: {
            where: { followerId: loginUserId }
          }
        }
      },
      _count: {
        select: { favorites: true },
      },
    };
  }
}
