import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Users } from '@prisma/client';


// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()


@Injectable()
export class UsersService {

  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.UsersCreateInput) : Promise<Users> {
  // async create(data: CreateUserDto) : Promise<Users> {
    return this.prismaService.users.create({
      data
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  currentUser() {
    return 'return current user';
  }

  updateUser() {
    return 'return update user';
  }
}
