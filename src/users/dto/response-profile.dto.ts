export class ResponseProfileDto {
  username: string;
  bio: string;
  image: string;
  following: boolean;

  constructor(user: any) {
    this.username = user.username;
    this.bio = user.bio;
    this.image = user.image;
    this.following = user.follows.length > 0;
  }
}
