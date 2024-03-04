import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryArticleDto {
  tag?: string;
  author?: string;
  favorited?: string;

  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @Type(() => Number)
  offset: number;

  get page() {
    return Math.floor(this.offset / this.limit);
  }

  totalPage(totalCount: number) {
    return Math.ceil(totalCount / this.limit);
  }
}

