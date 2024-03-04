import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('api/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getTop10Tags() {
    console.log('tag.controller::getTop10Tags(): 1:', 1);

    const tags = await this.tagService.getTop10Tags();
    console.log('tag.controller::getTop10Tags(): tags:', tags);

    return {tags: tags.map(tag => tag.tag)};
  }
}
