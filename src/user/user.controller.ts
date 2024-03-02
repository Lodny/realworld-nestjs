import { Body, Controller, Get, Logger, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WrapCreateUserDto } from '../users/dto/wrap-create-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { copyBasedOnDestination } from '../util';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { Token } from '../decorator/token/token.decorator';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/user')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Secured()
  currentUser(@LoginUser() loginUser: any, @Token() token: string){
    this.logger.log(`currentUser() : ${loginUser}`);
    console.log('user.controller::currentUser(): loginUser:', loginUser);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...loginUser, token})};
  }

  @Put()
  @Secured()
  async updateUser(@Body() wrapCreateUserDto: WrapCreateUserDto,
                   @LoginUser() loginUser: any,
                   @Token() token: string) {
    console.log('user.controller::updateUser(): wrapCreateUserDto.user:', wrapCreateUserDto.user);

    const updatedUser = await this.usersService.update(wrapCreateUserDto.user, loginUser.id);
    console.log('user.controller::updateUser(): updatedUser:', updatedUser);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...updatedUser, token})};
  }
}
