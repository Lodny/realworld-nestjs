import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ResponseProfileDto } from '../users/dto/response-profile.dto';
import { copyBasedOnDestination } from '../util';
import { AuthGuard } from '../auth/auth.guard';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { FollowService } from '../follow/follow.service';
import { Secured } from '../decorator/secured/secured.decorator';
import { AuthInterceptor } from '../auth/auth.interceptor';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService,
              private readonly followService: FollowService) {}

  @Get('/:username')
  async profile(@Param('username') username: string, @LoginUser() loginUser: any) {
    console.log('profiles.controller::profile(): username:', username);
    console.log('profiles.controller::profile(): loginUser:', loginUser);

    const foundUser = await this.followService.getUserWithFollowing(username, loginUser ? loginUser.id : -1);
    console.log('profiles.controller::profile(): foundUser:', foundUser);
    if (!foundUser)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return {profile: copyBasedOnDestination(new ResponseProfileDto(), {...foundUser, following: foundUser['follows'].length > 0})};

    // const foundUser = await this.followService.findOneByUsernameWithFollow(username, loginUser.id);
    // console.log('profiles.controller::profile(): foundUser:', foundUser);
    // if (foundUser.length < 0)
    //   throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    //
    // return {profile: copyBasedOnDestination(new ResponseProfileDto(), foundUser[0])};
  }

  @Secured()
  @Post('/:username/follow')
  async follow(@Param('username') username: string, @LoginUser() loginUser: any) {
    console.log('profiles.controller::follow(): username:', username);
    console.log('profiles.controller::follow(): loginUser:', loginUser);

    // const result = await this.followService.follow(username, loginUser.id);
    const result = await this.followService.followUser(username, loginUser.id);
    console.log('profiles.controller::follow(): result:', result);

    return result;
  }

  @Secured()
  @Delete('/:username/follow')
  async unfollow(@Param('username') username: string, @LoginUser() loginUser: any) {
    console.log('profiles.controller::unfollow(): username:', username);
    console.log('profiles.controller::unfollow(): loginUser:', loginUser);

    // const result = await this.followService.unfollow(username, loginUser.id);
    const result = await this.followService.unfollowUser(username, loginUser.id);
    console.log('profiles.controller::unfollow(): result:', result);

    return result;
  }
}
