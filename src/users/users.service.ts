import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaRepository } from '../prisma-repository.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

type EmailOrUsernameType = { username: string } | { email: string };

@Injectable()
export class UsersService {

  constructor(private readonly prismaRepository: PrismaRepository) {
    console.log('users.service::constructor(): 1:', 1);
  }

  async create(data: CreateUserDto) {
    return this.prismaRepository.user.create({
      data
    });
  }

  async findOneBy(where: EmailOrUsernameType, exceptionMessage: string, status: HttpStatus) {
    const foundUser = await this.prismaRepository.user.findUnique({where});
    if (!foundUser)
      throw new HttpException(exceptionMessage, status);

    // console.log('users.service::findOneByUsername(): foundUser:', foundUser);
    return foundUser;
  }

  login(loginUserDto: LoginUserDto) {
    return this.findOneBy(
      {email: loginUserDto.email},
      'username or password is invalid',
      HttpStatus.NOT_FOUND);
  }

  async update(updateUserDto: UpdateUserDto, loginUserId: number) {
    const foundUser = await this.findOneBy(
      {email: updateUserDto.email},
      'username or password is invalid',
      HttpStatus.NOT_FOUND);

    if (foundUser.id !== loginUserId)
      throw new HttpException('The logged-in user and the user information provided for modification are different.', HttpStatus.BAD_REQUEST);

    const updatedUser = this.prismaRepository.user.update({
      where: {id: loginUserId},
      data: updateUserDto
    });

    console.log('users.service::update(): updatedUser:', updatedUser);

    return updatedUser;
  }

  findOneByUsername(username: string) {
    return this.findOneBy(
      {username},
      `username[${username}] user is not exist`,
      HttpStatus.NOT_FOUND);
  }

  findOneByEmail(email: string) {
    return this.findOneBy(
      {email},
      `email[${email}] user is not exist`,
      HttpStatus.NOT_FOUND);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  currentUser() {
    return 'return current user';
  }
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  // async login(where: Prisma.UsersWhereUniqueInput) {
}
