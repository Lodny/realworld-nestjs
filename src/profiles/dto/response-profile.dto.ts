export class ResponseProfileDto {
  username: string;
  bio: string;
  image: string;
  following: boolean;

  constructor(user: any) {
    if (!user) return;

    this.username = user.username;
    this.bio = user.bio;
    this.image = user.image || 'https://api.realworld.io/images/demo-avatar.png';
    this.following = user.follows.length > 0;
  }
}
