import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { WrapCreateCommentDto } from './dto/wrap-create-comment.dto';
import { ResponseCommentDto } from './dto/response-comment.dto';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/articles/:slug')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Secured()
  @Post('/comments')
  async registerComment(@Param('slug') slug: string,
                        @Body() wrapCreateCommentDto: WrapCreateCommentDto,
                        @LoginUser() loginUser: any) {
    console.log('comment.controller::registerComment(): slug:', slug);
    console.log('comment.controller::registerComment(): wrapCreateCommentDto.comment:', wrapCreateCommentDto.comment);
    console.log('comment.controller::registerComment(): loginUser:', loginUser);

    const registeredComment = await this.commentService.registerComment(slug, wrapCreateCommentDto.comment, loginUser.id);
    console.log('comment.controller::registerComment(): registeredComment:', registeredComment);

    return {comment: new ResponseCommentDto(registeredComment)};
  }

  @Get('/comments')
  async getComments(@Param('slug') slug: string, @LoginUser() loginUser: any) {
    console.log('comment.controller::getComments(): slug:', slug);
    console.log('comment.controller::getComments(): loginUser:', loginUser);

    const comments = await this.commentService.getComments(slug, loginUser ? loginUser.id : -1);
    console.log('comment.controller::getComments(): comments:', comments);

    return {comments: comments.map(comment => new ResponseCommentDto(comment))};
  }
}
