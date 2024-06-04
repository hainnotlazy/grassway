import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(
    private tagsService: TagsService
  ) {}

  @Get()
  listTags(@CurrentUser() currentUser: User) {
    return this.tagsService.listTags(currentUser);
  }

  @Post()
  createTag(@CurrentUser() currentUser: User, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(currentUser, createTagDto);
  }

  @Put(":id")
  updateTag(
    @CurrentUser() currentUser: User, 
    @Param("id") id: string,
    @Body() updateTagDto: UpdateTagDto, 
  ) {
    return this.tagsService.updateTag(currentUser, id, updateTagDto);
  }

  @Delete(":id")
  @HttpCode(204)
  async deleteTag(@CurrentUser() currentUser: User, @Param('id') id: string) {
    await this.tagsService.deleteTag(currentUser, id);
    return "";
  }
}
