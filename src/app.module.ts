import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';
import { ArticleModule } from './article/article.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.${process.env.NODE_EVN}.env`,
    })
    , UsersModule
    , UserModule
    , ProfilesModule
    , ArticleModule
    , CommentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
