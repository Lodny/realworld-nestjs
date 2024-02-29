import { Body, Controller, Get, Headers, HttpException, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WrapCreateUserDto } from '../users/dto/wrap-create-user.dto';
import { copyBasedOnDestination } from '../util';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService,
              private readonly authService: AuthService) {}

  @Get()
  async currentUser(@Headers('Authorization') auth: string){
    // console.log('user.controller::currentUser(): auth:', auth);
    const token = this.getTokenString(auth);
    const currentUser = await this.getLoginUser(token);
    console.log('user.controller::currentUser(): currentUser:', currentUser);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...currentUser, token})};
  }

  private getTokenString(auth: string) {
    if (!auth || !auth.startsWith('Token '))
      throw new HttpException('token is invalid', HttpStatus.BAD_REQUEST);

    return auth.split(' ')[1];
  }

  private getLoginUser(token: string) {
    const { email } = this.authService.checkToken(token);
    console.log('user.controller::getLoginUser(): email:', email);

    return this.usersService.findOneByEmail(email);
  }

  @Put()
  async updateUser(@Body() wrapCreateUserDto: WrapCreateUserDto, @Headers('Authorization') auth: string) {
    console.log('user.controller::updateUser(): wrapCreateUserDto:', wrapCreateUserDto);

    const token = this.getTokenString(auth);
    const currentUser = await this.getLoginUser(token);

    const updatedUser = await this.usersService.update(wrapCreateUserDto.user, currentUser.id);
    console.log('user.controller::updateUser(): updatedUser:', updatedUser);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...updatedUser, token: 'token'})};
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
