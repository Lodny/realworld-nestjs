import { ResponseProfileDto } from '../../users/dto/response-profile.dto';

export class ResponseArticleDto {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];

  createdAt: Date;
  updatedAt: Date;

  favorited: boolean;
  favoritesCount: number;
  author: ResponseProfileDto;

  constructor(article: any) {
    this.slug = article.slug;
    this.title = article.title;
    this.description = article.description;
    this.body = article.body;

    this.tagList = article.tagList.map(tag => tag.tag);

    this.createdAt = article.createdAt;
    this.updatedAt = article.updatedAt;

    this.favorited = article.favorites.length > 0;
    this.favoritesCount = article._count.favorites;
    this.author = new ResponseProfileDto(article.author);
  }
}
