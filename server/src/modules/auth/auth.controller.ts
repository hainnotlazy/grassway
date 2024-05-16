import { Body, Controller, Get, HttpCode, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { GithubAuthGuard } from './guards/github-auth.guard';
import { GithubProfile } from 'src/common/models/github-profile.model';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser, PublicRoute, TokenExpirationTime } from 'src/common/decorators';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { GoogleProfile } from 'src/common/models/google-profile.model';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiExtraModels, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOAuth2, ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/login-user.dto';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { FacebookProfile } from 'src/common/models/facebook-profile.model';

@ApiTags("Auth")
@Controller('auth')
@ApiExtraModels(LoginUserDto)
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  @PublicRoute()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(200)
  @ApiOperation({
    summary: "Login route"
  })
  @ApiBody({
    type: LoginUserDto
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        access_token: {
          type: "string"
        }
      }
    },
    description: "Login successfully"
  })
  @ApiBadRequestResponse({
    description: "Username or password is incorrect",
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
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
  async login(@Request() req) {
    const user: User = req.user;

    return {
      access_token: await this.authService.generateAccessToken(user),
    }
  }

  @PublicRoute()
  @Post("register")
  @ApiOperation({
    summary: "Register route"
  })
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiOkResponse({
    schema: {
      type: "object",
      properties: {
        access_token: {
          type: "string"
        }
      }
    },
    description: "Register successfully"
  })
  @ApiResponse({
    status: 400,
    description: "Bad request",
    content: {
      "application/json": { 
        examples: {
          "Username already exists": {
            value: "Username already exists"
          },
          "Email already exists": {
            value: "Email already exists"
          }
        }
      }
    }
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error",
  })
  async register(@Body() body: RegisterUserDto) {
    const newUser = await this.userService.createUser(body);

    return {
      access_token: await this.authService.generateAccessToken(newUser),
    }
  }

  @Post("logout")
  @HttpCode(204)
  @ApiOperation({
    summary: "Logout route"
  })
  @ApiBearerAuth()
  @ApiNoContentResponse({
    description: "Logout successfully"
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
  async logout(
    @Request() request,
    @CurrentUser() currentUser: User,
    @TokenExpirationTime() tokenExpirationTime: number
  ) {
    const accessToken = request.headers.authorization.split(" ")[1];
    return this.authService.logout(currentUser, accessToken, tokenExpirationTime);
  }

  @PublicRoute()
  @UseGuards(GithubAuthGuard)
  @Get("github")
  @ApiOperation({
    summary: "Github authentication route"
  })
  async githubAuthenticate() {}

  @PublicRoute()
  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  @ApiOperation({
    summary: "Github authentication callback route"
  })
  async githubAuthenticateCallback(@Req() req: any, @Res() res: any) {
    const githubProfile: GithubProfile = req.user;
    const user = await this.authService.handleGithubAuthentication(githubProfile);

    if (!user) {
      return res.redirect(`${this.configService.get('CLIENT')}/u/my-account`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    res.cookie("access_token", accessToken, {
      // secure: true,
      sameSite: 'strict',
      maxAge: 60 * 1000
    })
    
    return res.redirect(`${this.configService.get('CLIENT')}/auth/success-authentication`);
  }

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google")
  @ApiOperation({
    summary: "Google authentication route"
  })
  async googleAuthenticate() {}

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
  @ApiOperation({
    summary: "Google authentication callback route"
  })
  async googleAuthenticateCallback(@Req() req: any, @Res() res: any) {
    const googleProfile: GoogleProfile = req.user;
    const user = await this.authService.handleGoogleAuthentication(googleProfile);

    if (!user) {
      return res.redirect(`${this.configService.get('CLIENT')}/u/my-account`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    res.cookie("access_token", accessToken, {
      // secure: true,
      sameSite: 'strict',
      maxAge: 60 * 1000
    })
    
    return res.redirect(`${this.configService.get('CLIENT')}/auth/success-authentication`);
  }

  @PublicRoute()
  @Get("facebook")
  @UseGuards(FacebookAuthGuard)
  async facebookAuthenticate() {}

  @PublicRoute()
  @Get("facebook/callback")
  @UseGuards(FacebookAuthGuard)
  async facebookAuthenticateCallback(@Req() req: any, @Res() res: any) {
    const facebookProfile: FacebookProfile = req.user;
    const user = await this.authService.handleFacebookAuthentication(facebookProfile);

    if (!user) {
      return res.redirect(`${this.configService.get('CLIENT')}/u/my-account`);
    }

    const accessToken = await this.authService.generateAccessToken(user);
    res.cookie("access_token", accessToken, {
      // secure: true,
      sameSite: 'strict',
      maxAge: 60 * 1000
    })

    return res.redirect(`${this.configService.get('CLIENT')}/auth/success-authentication`);
  }

  @PublicRoute()
  @Get("success-authentication")
  successAuthentication() {
    return "success";
  }

  @Get("whoami")
  async whoami(@CurrentUser() currentUser) {
    return currentUser;
  }
}
