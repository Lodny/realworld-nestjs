import { User } from '../entities/user.entity';

export class ResponseUserDto {
  constructor(username: string,
              email: string,
              password: string,
              image: any,
              token: string) {
    this.username = username;
    this.email = email;
  }

  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;

  static of(user: User, token: string) {
    return new ResponseUserDto(
      user.username,
      user.email,
      user.bio,
      user.image,
      token);
  }
}
