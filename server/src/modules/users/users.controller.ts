import { Body, Controller, Get, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get("my-profile")
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get current user profile",
    type: User
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized || Token is invalid",
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Get("/:id")
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get user by id",
    type: User
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized || Token is invalid",
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async getUserById(@Param("id") id: string) {
    return await this.usersService.findUser(id);
  }

  @Put("update-profile")
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("avatar")) 
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Update current user form data",
    type: UpdateProfileDto
  })
  @ApiOkResponse({
    description: "Update current user",
    type: User
  })
  @ApiBadRequestResponse({
    description: "Invalid user id",
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized || Token is invalid",
  })
  @ApiForbiddenResponse({
    description: "Account is inactive",
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  async updateProfile(
    @CurrentUser() currentUser: User, 
    @Body() body: UpdateProfileDto, 
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.usersService.updateUserProfile(currentUser, body, avatar);
  }
}
