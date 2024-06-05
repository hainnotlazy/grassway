import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findTag(currentUser: User, id: string) {
    return await this.tagRepository.findOne({ 
      where: { 
        id,
        owner: {
          id: currentUser.id
        }
      } 
    });
  }

  async listTags(currentUser: User) {
    return await this.tagRepository.find({ 
      where: { 
        owner: {
          id: currentUser.id
        }
      } 
    });
  }

  async createTag(currentUser: User, createTagDto: CreateTagDto) {
    const { name, description, icon } = createTagDto;

    // Validate tag (*base on requirements in Tag entity)
    const existedTags = await this.tagRepository.find({ 
      where: { 
        owner: {
          id: currentUser.id
        }
      }
    });

    if (existedTags.find(tag => tag.name === name)) {
      throw new BadRequestException("Tag's name is in used! Please try another name");
    } else if (existedTags.length > 10) {
      throw new BadRequestException("You have reached the limit of tags you can create!");
    }

    const tag = this.tagRepository.create({
      name,
      owner: currentUser,
      description,
      icon
    });

    return this.tagRepository.save(tag);
  }

  async updateTag(currentUser: User, id: string, updateTagDto: CreateTagDto) {
    const existedTag = await this.tagRepository.findOne({ 
      where: {
        id,
        owner: {
          id: currentUser.id
        }
      }
    });

    if (!existedTag) {
      throw new NotFoundException("Tag not found!");
    }

    Object.assign(existedTag, updateTagDto);

    return this.tagRepository.save(existedTag);
  }

  async deleteTag(currentUser: User, id: string) {
    const tag = await this.tagRepository.findOne({ 
      where: {
        id,
        owner: {
          id: currentUser.id
        }
      }
    });

    if (!tag) {
      throw new NotFoundException("Tag not found!");
    }

    return this.tagRepository.remove(tag);
  }
}
