import { User } from '../entities/user.entity';

export class ResponseUserDto {
  email: string = '';
  token: string = '';
  username: string = '';
  bio: string = '';
  image: string = '';

  // constructor(user: User, token: string) {
  //   this.email = user.email;
  //   this.token = token;
  //   this.username = user.username;
  //   this.bio = user.bio;
  //   this.image = user.image;
  // }

  // static of(user: User, token: string) {
  //   return new ResponseUserDto(
  //     user.email,
  //     token,
  //     user.username,
  //     user.bio,
  //     user.image,
  //   );
  // }
}
