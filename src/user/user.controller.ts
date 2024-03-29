import { Body, Controller, Get, Logger, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { Secured } from '../decorator/secured/secured.decorator';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { WrapUpdateUserDto } from '../users/dto/wrap-update-user.dto';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/user')
export class UserController {

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Secured()
  // currentUser(@LoginUser() loginUser: any, @Token() token: string){
  currentUser(@LoginUser() loginUser: any){
    this.logger.log(`currentUser() : ${loginUser}`);
    console.log('user.controller::currentUser(): loginUser:', loginUser);

    return {user: new ResponseUserDto(loginUser, loginUser.token)};
  }

  @Put()
  @Secured()
  async updateUser(@Body() wrapUpdateUserDto: WrapUpdateUserDto,
                   @LoginUser() loginUser: any) {
    console.log('user.controller::updateUser(): wrapUpdateUserDto.user:', wrapUpdateUserDto.user);

    const updatedUser = await this.usersService.update(wrapUpdateUserDto.user, loginUser.id);
    console.log('user.controller::updateUser(): updatedUser:', updatedUser);

    return {user: new ResponseUserDto(updatedUser, loginUser.token)};
  }
}
