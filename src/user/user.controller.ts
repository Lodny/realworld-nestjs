import { Body, Controller, Get, Headers, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WrapCreateUserDto } from '../users/dto/wrap-create-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { Secured } from '../decorator/secured/secured.decorator';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { LoginUser } from '../decorator/login-user/login-user.decorator';
import { User } from '../users/entities/user.entity';

@UseGuards(AuthGuard)
@UseInterceptors(AuthInterceptor)
@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService,
              private readonly authService: AuthService) {}

  @Get()
  @Secured()
  async currentUser(@LoginUser() loginUser: User){

    return 'hi';
    // console.log('user.controller::currentUser(): auth:', auth);
    // const token = this.getTokenString(auth);
    // const currentUser = await this.getLoginUser(token);
    // console.log('user.controller::currentUser(): currentUser:', currentUser);
    //
    // return {user: copyBasedOnDestination(new ResponseUserDto(), {...currentUser, token})};
  }



  private getLoginUser(token: string) {
    // const { email } = this.authService.checkToken(token);
    // console.log('user.controller::getLoginUser(): email:', email);

    // return this.usersService.findOneByEmail(email);
  }

  @Put()
  async updateUser(@Body() wrapCreateUserDto: WrapCreateUserDto, @Headers('Authorization') auth: string) {
    console.log('user.controller::updateUser(): wrapCreateUserDto:', wrapCreateUserDto);

    // const token = this.getTokenString(auth);
    // const currentUser = await this.getLoginUser(token);
    //
    // const updatedUser = await this.usersService.update(wrapCreateUserDto.user, currentUser.id);
    // console.log('user.controller::updateUser(): updatedUser:', updatedUser);
    //
    // return {user: copyBasedOnDestination(new ResponseUserDto(), {...updatedUser, token: 'token'})};
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
