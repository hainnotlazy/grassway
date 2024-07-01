import { Body, Controller, Get, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { UserSettingService } from './user-setting.service';
import { CurrentUser } from 'src/common/decorators';
import { User, UserSetting } from 'src/entities';
import { UserSettingDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(
    private userSettingService: UserSettingService
  ) {}

  @Get("user")
  @ApiOperation({ summary: 'Get user setting' })
  @ApiBearerAuth()
  @ApiOkResponse({ 
    description: 'Get user setting successfully',
    type: UserSetting 
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
  getUserSetting(@CurrentUser() currentUser: User) {
    return this.userSettingService.getUserSetting(currentUser);
  }

  @Put("user")
  @UseInterceptors(FileInterceptor('logo'))
  @ApiOperation({ summary: 'Update user setting' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update user setting successfully',
    type: UserSetting
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
  updateUserSetting(
    @CurrentUser() currentUser: User,
    @Body() userSettingDto: UserSettingDto,
    @UploadedFile() logo: Express.Multer.File
  ) {
    return this.userSettingService.updateUserSetting(
      currentUser, 
      userSettingDto, 
      logo
    );
  }
}
