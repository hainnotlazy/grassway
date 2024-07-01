import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Tag, TaggedUrl } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreateTagDto } from './dtos';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private dataSource: DataSource
  ) {}

  /**
   * Describe: Find tag by id
  */
  async findTag(currentUser: User, id: number) {
    return await this.tagRepository.findOne({ 
      where: { 
        id,
        owner: {
          id: currentUser.id
        }
      } 
    });
  }

  /**
   * Describe: List all tags of current user
  */
  async listTags(currentUser: User) {
    return await this.tagRepository.find({ 
      where: { 
        owner: {
          id: currentUser.id
        }
      } 
    });
  }

  /**
   * Describe: Create new tag
  */
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

  /**
   * Describe: Update existed tag
  */
  async updateTag(currentUser: User, id: number, updateTagDto: CreateTagDto) {
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

  /**
   * Describe: Delete existed tag
  */
  async deleteTag(currentUser: User, id: number) {
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await queryRunner.manager.delete(TaggedUrl, { tag: { id: tag.id } });
      await queryRunner.manager.delete(Tag, { id: tag.id });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    } 
  }
}
