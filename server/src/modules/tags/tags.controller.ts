import { Body, Controller, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  
  constructor(
    private tagsService: TagsService
  ) {}

  @Post()
  createTag(@CurrentUser() currentUser: User, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(currentUser, createTagDto);
  }
}
