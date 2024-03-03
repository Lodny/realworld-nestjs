import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArticleService } from './article.service';
import { WrapCreateArticleDto } from './dto/wrap-create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { QueryArticleDto } from './dto/query-article.dto';
import { ResponseArticleDto } from './dto/response-article.dto';
import { WrapUpdateArticleDto } from './dto/wrap-update-article.dto';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @Secured()
  async registerArticle(@Body() wrapCreateArticleDto: WrapCreateArticleDto, @LoginUser() loginUser: any) {
    console.log('article.controller::registerArticle(): wrapCreateArticleDto.article:', wrapCreateArticleDto.article);
    console.log('article.controller::registerArticle(): loginUser:', loginUser);

    const article = await this.articleService.createArticle(wrapCreateArticleDto.article, loginUser.id);
    console.log('article.controller::registerArticle(): article:', article);

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
    console.log('article.controller::getArticles(): query:', query);
    console.log('article.controller::getArticles(): loginUser:', loginUser);

    const articles = await this.articleService.getArticles(query, loginUser ? loginUser.id : -1);
    console.log('article.controller::getArticles(): articles:', articles);

    return {articles: articles.map(article => new ResponseArticleDto(article))};
  }

  @Get('/feed')
  @Secured()
  async getFeedArticles(@Query() query: QueryArticleDto, @LoginUser() loginUser: any) {
    console.log('article.controller::getFeedArticles(): query:', query);
    console.log('article.controller::getFeedArticles(): loginUser:', loginUser);

    const articles = await this.articleService.getFeedArticles(query, loginUser ? loginUser.id : -1);
    console.log('article.controller::getFeedArticles(): articles:', articles);

    return {articles: articles.map(article => new ResponseArticleDto(article))};
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

}
