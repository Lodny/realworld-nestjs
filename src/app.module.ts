import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserModule } from './user/user.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule
    , UserModule
    , ProfilesModule
    , ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `.${process.env.NODE_EVN}.env`,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
