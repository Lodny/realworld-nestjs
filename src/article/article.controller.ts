import { Body, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArticleService } from './article.service';
import { WrapCreateArticleDto } from './dto/wrap-create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { QueryArticleDto } from './dto/query-article.dto';
import { ResponseArticleDto } from './dto/response-article.dto';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Secured()
  async registerUser(@Body() wrapCreateArticleDto: WrapCreateArticleDto, @LoginUser() loginUser: any) {
    console.log('article.controller::registerUser(): wrapCreateArticleDto.article:', wrapCreateArticleDto.article);
    console.log('article.controller::registerUser(): loginUser:', loginUser);

    const article = await this.articleService.createArticle(wrapCreateArticleDto.article, loginUser.id);
    console.log('article.controller::registerUser(): article:', article);

    delete article.id;
    delete article.author.id;

    return {article: {...article, tagList: article.tagList.map(tag => tag.tag)}};
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string, @LoginUser() loginUser: any) {
    console.log('article.controller::getArticle(): slug:', slug);
    console.log('article.controller::getArticle(): loginUser:', loginUser);

    const article = await this.articleService.getArticleBySlug(slug, loginUser ? loginUser.id: -1);
    console.log('article.controller::getArticle(): article:', article);

    return {article: new ResponseArticleDto(article)};
  }

  @Get()
  async getArticles(@Query() query: QueryArticleDto, @LoginUser() loginUser: any) {
  // getArticles(@Query('offset') offset: string, @LoginUser() loginUser: any) {
    console.log('article.controller::getArticles(): query:', query);
    // console.log('article.controller::getArticles(): offset:', offset);
    console.log('article.controller::getArticles(): loginUser:', loginUser);

    const articles = await this.articleService.getArticles(query, loginUser ? loginUser.id : -1);
    console.log('article.controller::getArticles(): articles:', articles);

    return {articles: articles.map(article => new ResponseArticleDto(article))};
  }

}
