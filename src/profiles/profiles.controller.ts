import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ResponseProfileDto } from '../users/dto/response-profile.dto';
import { copyBasedOnDestination } from '../util';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly usersService: UsersService) {}

  // @Get('/:id')
  // async profileById(@Param('id', ParseIntPipe) id: number) {
  // }

  @Get('/:username')
  async profile(@Param('username') username: string) {
    console.log('profiles.controller::profile(): username:', username);

    const foundUser = await this.usersService.findOneByUsername(username);
    console.log('profiles.controller::profile(): foundUser:', foundUser);

    return {profile: copyBasedOnDestination(new ResponseProfileDto(), {...foundUser, following: false})};
  }
}
