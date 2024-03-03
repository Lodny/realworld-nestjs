import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ArticleService } from './article.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { WrapCreateArticleDto } from './dto/wrap-create-article.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';

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


    const following = article.author.follows.length > 0;
    delete article.id;
    delete article.authorId;
    delete article.author.id;
    delete article.author.password;
    delete article.author.email;
    delete article.author.follows;

    return {article: {
      ...article
        , tagList: article.tagList.map(tag => tag.tag)
        , author: {
          ...article.author,
          following
        }
    }};
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
