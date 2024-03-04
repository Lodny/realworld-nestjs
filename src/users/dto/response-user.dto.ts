export class ResponseUserDto {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;

  constructor(user: any, token: string) {
    this.email = user.email;
    this.token = token;
    this.username = user.username;
    this.bio = user.bio;
    this.image = user.image;
  }
}
