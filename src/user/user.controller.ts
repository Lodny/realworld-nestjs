import { Body, Controller, Put } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { WrapCreateUserDto } from '../users/dto/wrap-create-user.dto';
import { copyBasedOnDestination } from '../util';
import { ResponseUserDto } from '../users/dto/response-user.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // currentUser(){
  //   return this.usersService.findOneByEmail();
  // }

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
