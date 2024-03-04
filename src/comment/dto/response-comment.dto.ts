import { ResponseProfileDto } from '../../profiles/dto/response-profile.dto';

export class ResponseCommentDto {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: ResponseProfileDto;

  constructor(comment: any) {
    this.id = comment.id;
    this.body = comment.body;
    this.createdAt = comment.createdAt;
    this.updatedAt = comment.updatedAt;
    this.author = new ResponseProfileDto(comment.author);
  }
}
