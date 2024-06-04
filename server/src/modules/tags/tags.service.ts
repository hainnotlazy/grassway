import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/entities/tag.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}


  createTag(currentUser: User, createTagDto: CreateTagDto) {
    const { name, description, icon } = createTagDto;
    const tag = this.tagRepository.create({
      name,
      owner: currentUser,
      description,
      icon
    });

    return this.tagRepository.save(tag);
  }
}
