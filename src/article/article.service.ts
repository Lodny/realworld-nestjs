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

  async getArticles(query: QueryArticleDto, loginUserId: number) {
    console.log('article.service::getArticles(): loginUserId:', loginUserId);

    const where = query.tag
      ? this.getTagWhere(query.tag)
      : query.author
        ? await this.getAuthorWhere(query.author)
        : query.favorited
          ? await this.getFavoritedWhere(query.favorited)
          : {};

    const totalCount = await this.prisma.article.count({where});
    console.log('article.service::getArticles(): totalCount:', totalCount);

    const articles = await this.prisma.article.findMany({
      skip: query.offset,
      take: query.limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: this.getInclude(loginUserId)
    });

    return {articles, totalCount};
  }

  private getTagWhere(tag) {
    return { tagList: { some: { tag: { contains: tag } } } };
  }

  private async getAuthorWhere(author) {
    const user = await this.prisma.user.findUnique({ where: { username: author } });
    console.log('article.service::getAuthorWhere(): user:', user);

    return { authorId: user.id };
  }

  private async getFavoritedWhere(favorited) {
    const user = await this.prisma.user.findUnique({
      where: { username: favorited },
      include: { favorites: true }
    });

    return { id: { in: user.favorites.map(f => f.articleId) } }
  }

  async getFeedArticles(query: QueryArticleDto, loginUserId: number) {
    console.log('article.service::getFeedArticles(): loginUserId:', loginUserId);

    const loginUser = await this.prisma.user.findUnique({
      where: { id: loginUserId },
      // include: { followers: true },
      select: { followers: true }
    });
    console.log('article.service::getFeedArticles(): loginUser', loginUser);

    const where = { authorId: {
        in: loginUser.followers.map(follower => follower.followingId)
      } };

    const totalCount = await this.prisma.article.count({where});
    console.log('article.service::getArticles(): totalCount:', totalCount);

    const articles = await this.prisma.article.findMany({
      skip: query.offset,
      take: query.limit,
      where,
      orderBy: { createdAt: 'desc' },
      include: this.getInclude(loginUserId)
    });

    return {articles, totalCount};
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
