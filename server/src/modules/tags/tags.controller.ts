import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CurrentUser } from 'src/common/decorators';
import { User, Tag } from 'src/entities';
import { CreateTagDto, UpdateTagDto } from './dtos';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Tags")
@Controller('tags')
export class TagsController {
  constructor(
    private tagsService: TagsService
  ) {}

  @Get()
  @ApiOperation({ summary: "Get list of tags" })
  @ApiBearerAuth()
  @ApiOkResponse({ 
    description: "List of tags",
    type: [Tag]
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  listTags(@CurrentUser() currentUser: User) {
    return this.tagsService.listTags(currentUser);
  }

  @Post()
  @ApiOperation({ summary: "Create new tag" })
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Tag created successfully",
    type: Tag
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          },
          "Tag's name is in used": {
            value: "Tag's name is in used! Please try another name"
          },
          "Limit of creating tags": {
            value: "You have reached the limit of tags you can create!"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  createTag(@CurrentUser() currentUser: User, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.createTag(currentUser, createTagDto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update tag" })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Update tag successfully",
    type: Tag
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Tag not found": {
            value: "Tag not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  updateTag(
    @CurrentUser() currentUser: User, 
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto, 
  ) {
    return this.tagsService.updateTag(currentUser, id, updateTagDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @ApiOperation({ summary: "Delete tag" })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Delete tag successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized",
    content: {
      "application/json": { 
        examples: {
          "Unauthorized": {
            value: "Unauthorized"
          },
          "Token is invalid": {
            value: "Token is invalid"
          }
        }
      }
    }
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": { 
        examples: {
          "User not found": {
            value: "User not found"
          },
          "Tag not found": {
            value: "Tag not found"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async deleteTag(
    @CurrentUser() currentUser: User, 
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.tagsService.deleteTag(currentUser, id);
    return;
  }
}
