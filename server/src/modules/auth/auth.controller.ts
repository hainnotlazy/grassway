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

@Controller('auth')
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
  async login(@Request() req) {
    const user: User = req.user;

    return {
      access_token: await this.authService.generateAccessToken(user),
    }
  }

  @PublicRoute()
  @Post("register")
  async register(@Body() body: RegisterUserDto) {
    const newUser = await this.userService.createUser(body);

    return {
      access_token: await this.authService.generateAccessToken(newUser),
    }
  }

  @Post("logout")
  @HttpCode(204)
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
  async githubAuthenticate() {}

  @PublicRoute()
  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
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
  async googleAuthenticate() {}

  @PublicRoute()
  @UseGuards(GoogleAuthGuard)
  @Get("google/callback")
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

  @Get("whoami")
  async whoami(@CurrentUser() currentUser) {
    return currentUser;
  }
}
