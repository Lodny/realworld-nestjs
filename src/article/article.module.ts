import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { UsersModule } from '../users/users.module';
import { FavoriteService } from '../favorite/favorite.service';

@Module({
  imports: [UsersModule],
  controllers: [ArticleController],
  providers: [ArticleService, FavoriteService],
})
export class ArticleModule {}
