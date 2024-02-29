import { Body, Controller, Get, Headers, HttpException, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WrapCreateUserDto } from '../users/dto/wrap-create-user.dto';
import { copyBasedOnDestination } from '../util';
import { ResponseUserDto } from '../users/dto/response-user.dto';
import { AuthService } from '../auth/auth.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService,
              private readonly authService: AuthService) {}

  @Get()
  currentUser(@Headers('Authorization') auth: string){
    // console.log('user.controller::currentUser(): auth:', auth);
    if (!auth.startsWith('Token '))
      throw new HttpException('token is invalid', HttpStatus.BAD_REQUEST);

    const {email} = this.authService.checkToken(auth.split(' ')[1]);
    console.log('user.controller::currentUser(): email:', email);

    const currentUser = this.usersService.findOneByEmail(email);
    console.log('user.controller::currentUser(): currentUser:', currentUser);

    return currentUser;
  }

  @Put()
  async updateUser(@Body() wrapCreateUserDto: WrapCreateUserDto) {
    console.log('user.controller::updateUser(): wrapCreateUserDto:', wrapCreateUserDto);
    const updatedUser = await this.usersService.update(wrapCreateUserDto.user);
    console.log('user.controller::updateUser(): updatedUser:', updatedUser);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...updatedUser, token: 'token'})};
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }
}
