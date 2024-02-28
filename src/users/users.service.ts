import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaRepository } from '../prisma-repository.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';


// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()


@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaRepository) {}

  async create(data: CreateUserDto) {
    return this.prismaService.users.create({
      data
    });
  }

  async login(loginUserDto: LoginUserDto) {
    const foundUser = this.prismaService.users.findUnique({
      where: {email: loginUserDto.email}
    });

    console.log('users.service::login(): foundUser:', foundUser);
    return foundUser;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  currentUser() {
    return 'return current user';
  }

  async update(updateUserDto: UpdateUserDto) {
    const foundUser = this.prismaService.users.findUnique({
      where: {email: updateUserDto.email}
    });

    console.log('users.service::update(): foundUser:', foundUser);

    return foundUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  // async login(where: Prisma.UsersWhereUniqueInput) {
}
