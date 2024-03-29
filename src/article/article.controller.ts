import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArticleService } from './article.service';
import { WrapCreateArticleDto } from './dto/wrap-create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { QueryArticleDto } from './dto/query-article.dto';
import { ResponseArticleDto } from './dto/response-article.dto';
import { WrapUpdateArticleDto } from './dto/wrap-update-article.dto';
import { FavoriteService } from '../favorite/favorite.service';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService,
              private readonly favoriteService: FavoriteService) {}

  @Post()
  @Secured()
  async registerArticle(@Body() wrapCreateArticleDto: WrapCreateArticleDto, @LoginUser() loginUser: any) {
    console.log('article.controller::registerArticle(): wrapCreateArticleDto.article:', wrapCreateArticleDto.article);
    console.log('article.controller::registerArticle(): loginUser:', loginUser);

    const registeredArticle = await this.articleService.registerArticle(wrapCreateArticleDto.article, loginUser.id);
    console.log('article.controller::registerArticle(): article:', registeredArticle);

    return {article: new ResponseArticleDto(registeredArticle)};
  }

  @Secured()
  @Get('/feed')
  async getFeedArticles(@Query() query: QueryArticleDto, @LoginUser() loginUser: any) {
    console.log('article.controller::getFeedArticles(): query:', query);
    console.log('article.controller::getFeedArticles(): loginUser:', loginUser);

    const articlePage = await this.articleService.getFeedArticles(query, loginUser.id);
    console.log('article.controller::getFeedArticles(): articlePage:', articlePage);

    return {
      articles: articlePage.articles.map(article => new ResponseArticleDto(article)),
      articlesCount: articlePage.articles.length,
      number: query.page,
      totalPages: query.totalPage(articlePage.totalCount),
    };
  }

  @Get('/:slug')
  async getArticle(@Param('slug') slug: string, @LoginUser() loginUser: any) {
    console.log('article.controller::getArticle(): slug:', slug);
    console.log('article.controller::getArticle(): loginUser:', loginUser);

    const article = await this.articleService.getArticleBySlug(slug, loginUser ? loginUser.id: -1);
    console.log('article.controller::getArticle(): article:', article);

    return {article: new ResponseArticleDto(article)};
  }

  @Get()
  async getArticles(@Query() query: QueryArticleDto, @LoginUser() loginUser: any) {
    console.log('article.controller::getArticles(): query:', query);
    console.log('article.controller::getArticles(): loginUser:', loginUser);

    const articlePage = await this.articleService.getArticles(query, loginUser ? loginUser.id : -1);
    console.log('article.controller::getArticles(): articlePage:', articlePage);

    return {
      articles: articlePage.articles.map(article => new ResponseArticleDto(article)),
      articlesCount: articlePage.articles.length,
      number: query.page,
      totalPages: query.totalPage(articlePage.totalCount),
    };
  }

  @Put('/:slug')
  @Secured()
  async updateArticle(@Param('slug') slug: string,
                      @Body() wrapUpdateArticleDto: WrapUpdateArticleDto,
                      @LoginUser() loginUser: any) {
    console.log('article.controller::updateArticle(): slug:', slug);
    console.log('article.controller::updateArticle(): wrapUpdateArticleDto.article:', wrapUpdateArticleDto.article);
    console.log('article.controller::updateArticle(): loginUser:', loginUser);

    const updatedArticle = await this.articleService.updateArticle(slug, wrapUpdateArticleDto.article, loginUser.id);
    console.log('article.controller::updateArticle(): updatedArticle:', updatedArticle);

    return {article: new ResponseArticleDto(updatedArticle)};
  }

  @Delete('/:slug')
  @Secured()
  async deleteArticle(@Param('slug') slug: string, @LoginUser() loginUser: any) {
    console.log('article.controller::deleteArticle(): slug:', slug);
    console.log('article.controller::deleteArticle(): loginUser:', loginUser);

    const article = await this.articleService.deleteArticle(slug, loginUser.id);
    return {article: new ResponseArticleDto(article)};
  }

  @Post('/:slug/favorite')
  @Secured()
  async favoriteArticle(@Param('slug') slug: string, @LoginUser() loginUser: any) {
    console.log('article.controller::favoriteArticle(): slug:', slug);
    console.log('article.controller::favoriteArticle(): loginUser:', loginUser);

    const article = await this.favoriteService.favoriteArticle(slug, loginUser.id);
    return {article: new ResponseArticleDto(article)};
  }

  @Delete('/:slug/favorite')
  @Secured()
  async unfavoriteArticle(@Param('slug') slug: string, @LoginUser() loginUser: any) {
    console.log('article.controller::unfavoriteArticle(): slug:', slug);
    console.log('article.controller::unfavoriteArticle(): loginUser:', loginUser);

    const article = await this.favoriteService.unfavoriteArticle(slug, loginUser.id);
    console.log('article.controller::unfavoriteArticle(): article:', article);

    return {article: new ResponseArticleDto(article)};
  }
}
