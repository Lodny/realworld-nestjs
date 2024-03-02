import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaRepository } from '../prisma-repository.service';

@Injectable()
export class FollowService {

  private prismaClient  = new PrismaClient();

  constructor(private readonly prismaRepository: PrismaRepository) {}

  async follow(followeeUsername: string, followerId: number) {
    console.log('follow.service::follow(): followerId:', followerId);

    const foundUser = await this.prismaRepository.users.findUnique(
      {where: {username: followeeUsername}
      });
    console.log('follow.service::follow(): foundUser:', foundUser);

    return this.prismaClient.$executeRaw`
      insert into "Follow" (followee_id, follower_id)
      values (${foundUser.id}, ${followerId})
    `;
    // const result = await this.prismaClient.$executeRawUnsafe(`
    //   insert into "Follow"
    //   (followee_id, follower_id)
    //   values ($1, $2)`
    //   , foundUser.id, followerId);
  }

  async unfollow(followeeUsername: string, followerId: number) {
    const foundUser = await this.prismaRepository.users.findUnique(
      {where: {username: followeeUsername}
      });
    console.log('follow.service::unfollow(): foundUser:', foundUser);

    return this.prismaClient.$executeRaw`
      delete from "Follow"
      where  followee_id = ${foundUser.id}
      and    follower_id = ${followerId}
    `;
  }
}
