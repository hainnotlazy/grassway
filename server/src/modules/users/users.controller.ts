import { Body, Controller, DefaultValuePipe, Get, HttpCode, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, PublicRoute } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@ApiTags("Users")
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get("")
  @ApiOperation({
    summary: "Get current user profile",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get current user profile successfully",
    type: User
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
  async getCurrentUser(@CurrentUser() currentUser: User) {
    return currentUser;
  }
  
  @Get("/filter")
  async filterUsers(
    @CurrentUser() currentUser: User,
    @Query("query", new DefaultValuePipe("")) query: string,
  ) {
    return await this.usersService.filterUsers(currentUser, query);
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Get user's profile by id",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Get user by id successfully",
    type: User
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
  async getUserById(@Param("id") id: string) {
    return await this.usersService.findUser(id);
  }

  @Put("")
  @UseInterceptors(FileInterceptor("avatar")) 
  @ApiOperation({
    summary: "Update current user profile",
  })
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Update current user form data",
    type: UpdateProfileDto
  })
  @ApiOkResponse({
    description: "Update current user successfully",
    type: User
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
  async updateProfile(
    @CurrentUser() currentUser: User, 
    @Body() body: UpdateProfileDto, 
    @UploadedFile() avatar: Express.Multer.File
  ) {
    return this.usersService.updateUserProfile(currentUser, body, avatar);
  }

  @Post("/resend-verification-code")
  @HttpCode(200)
  @ApiOperation({
    summary: "Resend verification code",
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Resend verification code successfully",
    content: {
      "application/json": { 
        examples: {
          "Response": {
            value: {
              "next_email_verification_time": "2024-05-05T00:00:00.000Z"  
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "User don't have email to verify": {
            value: "User don't have email to verify"
          },
          "Email already verified": {
            value: "Email already verified"
          },
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
  @ApiResponse({
    status: 500,
    description: "Internal Server Error",
    content: {
      "application/json": { 
        examples: {
          "Internal Server Error": {
            value: "Internal Server Error"
          },
          "Error when send mail": {
            value: "Somethings went wrong when sending verification mail!"
          }
        }
      }
    }
  })
  async resendVerificationCode(@CurrentUser() currentUser: User) {
    const userSentMail = await this.usersService.sendVerificationEmailMail(currentUser);
    return {
      "next_email_verification_time": userSentMail.next_email_verification_time
    };
  }

  @Put("/verify-email")
  @HttpCode(204)
  @ApiOperation({
    summary: "Verify email",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Verify email successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Invalid verification code": {
            value: "Invalid verification code"
          },
          "User don't have email to verify": {
            value: "User don't have email to verify"
          },
          "Email already verified": {
            value: "Email already verified"
          },
          "Verification code is incorrect": {
            value: "Verification code is incorrect"
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
  async verifyEmail(@CurrentUser() currentUser: User, @Body() body: VerifyEmailDto) {
    await this.usersService.verifyEmail(currentUser, body);
    return "";
  }

  @Put("/change-password")
  @HttpCode(204)
  @ApiOperation({
    summary: "Change password",
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Verify email successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Invalid user id": {
            value: "Invalid user id"
          },
          "Password is incorrect": {
            value: "Password is incorrect"
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
  async changePassword(@CurrentUser() currentUser: User, @Body() body: ChangePasswordDto) {
    await this.usersService.changePassword(currentUser, body);
    return "";
  }

  @PublicRoute()
  @Post("/forget-password")
  @HttpCode(200)
  @ApiOperation({
    summary: "Forget password"
  })
  @ApiOkResponse({
    description: "Send reset password code successfully",
    type: User
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async forgetPassword(@Body() body: ForgetPasswordDto) {
    return this.usersService.forgetPassword(body.email);
  }

  @PublicRoute()
  @Put("/reset-password")
  @HttpCode(204)
  @ApiOperation({
    summary: "Reset password"
  })
  @ApiNoContentResponse({
    description: "Reset password successfully",
  })
  @ApiBadRequestResponse({
    description: "Invalid reset code"
  })
  @ApiNotFoundResponse({
    description: "User not found",
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.usersService.resetPassword(body);
    return "";
  }
}
