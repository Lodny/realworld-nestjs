import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { WrapCreateUserDto } from './dto/wrap-create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { WrapLoginUserDto } from './dto/wrap-login-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';

// import { Response } from 'express';

@UseGuards(AuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
              private readonly authService: AuthService) {}

  @Post()
  // @HttpCode(HttpStatus.OK)
  async register(@Body() wrapCreateUserDto: WrapCreateUserDto) {
    console.log('users.controller::register(): wrapCreateUserDto:', wrapCreateUserDto);
    const registeredUser = await this.usersService.create(wrapCreateUserDto.user);
    console.log('users.controller::register(): registeredUser:', registeredUser);

    const token = this.authService.createToken({email: registeredUser.email});
    console.log('users.controller::register(): token:', token);

    return { user: new ResponseUserDto(registeredUser, token)};
  }

  @Post('/login')
  async login(@Body() wrapLoginUserDto: WrapLoginUserDto) {
    console.log('users.controller::login(): wrapLoginUserDto:', wrapLoginUserDto);
    const loginUser = await this.usersService.login(wrapLoginUserDto.user);
    console.log('users.controller::login(): loginUser:', loginUser);

    const token = this.authService.createToken({email: loginUser.email});
    console.log('users.controller::login(): token:', token);

    return { user: new ResponseUserDto(loginUser, token)};
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
}
