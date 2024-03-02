import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ResponseProfileDto } from '../users/dto/response-profile.dto';
import { copyBasedOnDestination } from '../util';
import { AuthGuard } from '../auth/auth.guard';
import { LoginUser } from '../decorator/login-user/login-user.decorator';

@UseGuards(AuthGuard)
@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:username')
  async profile(@Param('username') username: string, @LoginUser() loginUser: any) {
    console.log('profiles.controller::profile(): username:', username);
    console.log('profiles.controller::profile(): loginUser:', loginUser);

    const foundUser = await this.usersService.findOneByUsername(username);
    console.log('profiles.controller::profile(): foundUser:', foundUser);

    return {profile: copyBasedOnDestination(new ResponseProfileDto(), {...foundUser, following: false})};
  }
}
