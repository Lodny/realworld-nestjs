import { Body, Controller, Delete, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { WrapCreateUserDto } from './dto/wrap-create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { copyBasedOnDestination } from '../util';
import { WrapLoginUserDto } from './dto/wrap-login-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(@Body() wrapCreateUserDto: WrapCreateUserDto) {
    console.log('users.controller::register(): wrapCreateUserDto:', wrapCreateUserDto);
    const user = await this.usersService.create(wrapCreateUserDto.user);
    console.log('users.controller::register(): user:', user);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...user, token: 'token'})};
  }

  @Post('/login')
  async login(@Body() wrapLoginUserDto: WrapLoginUserDto) {
    console.log('users.controller::login(): wrapLoginUserDto:', wrapLoginUserDto);
    const loginUser = await this.usersService.login(wrapLoginUserDto.user);
    console.log('users.controller::login(): loginUser:', loginUser);

    return {user: copyBasedOnDestination(new ResponseUserDto(), {...loginUser, token: 'token'})};
  }

  @Post('/login2')
  login2(@Body() loginUserDto: LoginUserDto) {
  // login2(@Body() loginUserDto: LoginUserDto) {
    console.log('users.controller::login2(): loginUserDto:', loginUserDto);
  }

  //todo::check @ValidateNested()
  @Post('/login3')
  async login3(@Body() wrapLoginUserDto: WrapLoginUserDto) {
    console.log('users.controller::login2(): wrapLoginUserDto:', wrapLoginUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
