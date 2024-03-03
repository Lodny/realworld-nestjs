import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { PrismaRepository } from '../prisma-repository.service';

@Injectable()
export class FollowService {

  private prismaClient  = new PrismaClient();

  constructor(private readonly prisma: PrismaRepository) {}

  private async findByUsername(followingUsername: string) {
    const followingUser = await this.prisma.user.findUnique({
      where: { username: followingUsername }
    });

    if (!followingUser) {
      throw new Error(`User with name ${followingUsername} not found.`);
    }

    return followingUser;
  }

  async followUser(followingUsername: string, followerId: number): Promise<void> {
    const followingUser = await this.findByUsername(followingUsername);

    await this.prisma.follow.create({
      data: {
        followerId,
        followingId: followingUser.id
      },
    });
  }

  async unfollowUser(followingUsername: string, followerId: number): Promise<void> {
    const followingUser = await this.findByUsername(followingUsername);

    // await this.prisma.follow.deleteMany({
    //   where: {
    //     followerId,
    //     followingId: followingUser.id
    //   },
    // });
    await this.prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId: followingUser.id
        }
      },
    });
  }

  getUserWithFollowing(followingUsername: string, followerId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username: followingUsername },
      include: {
        follows: {
          where: {
            followerId
          },
        //   take: 1 // 하나의 팔로우 정보만 가져옵니다.
        }
      }
    });
  }





  // no orm-modeling
  async follow(followeeUsername: string, followerId: number) {
    console.log('follow.service::follow(): followerId:', followerId);

    const foundUser = await this.prisma.user.findUnique(
      {where: {username: followeeUsername}
      });
    console.log('follow.service::follow(): foundUser:', foundUser);

    return this.prismaClient.$executeRaw`
      insert into "Follow"
      values (${foundUser.id}, ${followerId})
    `;
    // const result = await this.prismaClient.$executeRawUnsafe(`
    //   insert into "Follow"
    //   (followee_id, follower_id)
    //   values ($1, $2)`
    //   , foundUser.id, followerId);
  }

  async unfollow(followeeUsername: string, followerId: number) {
    const foundUser = await this.prisma.user.findUnique(
      {where: {username: followeeUsername}
      });
    console.log('follow.service::unfollow(): foundUser:', foundUser);

    return this.prismaClient.$executeRaw`
      delete from "Follow"
      where  followee_id = ${foundUser.id}
      and    follower_id = ${followerId}
    `;
  }

  async findOneByUsernameWithFollow(username: string, loginUserId: number): Promise<any[]> {
    const foundUser = await this.prisma.user.findUnique({where: {username}});
    console.log('follow.service::follow(): foundUser:', foundUser);

    return this.prismaClient.$queryRaw`
      select  u.*
            , (case when f.follower_id is not null then true else false end) as following
      from    "Users" u 
      left join "Follow" f on f.followee_id = u.id and f.follower_id = ${loginUserId}
      where   u.id = ${foundUser.id}
    `;
  }
}
