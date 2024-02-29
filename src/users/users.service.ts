import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaRepository } from '../prisma-repository.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {

  constructor(private readonly prismaRepository: PrismaRepository) {}

  async create(data: CreateUserDto) {
    return this.prismaRepository.users.create({
      data
    });
  }

  login(loginUserDto: LoginUserDto) {
    const foundUser = this.prismaRepository.users.findUnique({
      where: {email: loginUserDto.email}
    });

    console.log('users.service::login(): foundUser:', foundUser);
    return foundUser;
  }

  update(updateUserDto: UpdateUserDto) {
    // const foundUser = this.prismaRepository.users.findUniqueOrThrow({
    //   where: {email: updateUserDto.email}
    // });
    //todo::check values

    const updatedUser = this.prismaRepository.users.update({
      where: {email: updateUserDto.email},
      data: updateUserDto
    });

    console.log('users.service::update(): updatedUser:', updatedUser);

    return updatedUser;
  }

  async findOneByUsername(username: string) {
    const foundUser = this.prismaRepository.users.findUniqueOrThrow({
      where: {username},
    });

    console.log('users.service::findOneByUsername(): foundUser:', foundUser);

    return foundUser;
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
