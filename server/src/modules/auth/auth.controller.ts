import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { GithubAuthGuard } from './guards/github.guard';
import { GithubProfile } from 'src/common/models/github-profile.model';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService
  ) {}

  @Post("register")
  async registerAccount(@Body() body: RegisterUserDto) {
    return await this.userService.createUser(body);
  }

  @UseGuards(GithubAuthGuard)
  @Get("github")
  async githubAuthenticate() {}

  @UseGuards(GithubAuthGuard)
  @Get("github/callback")
  async githubAuthenticateCallback(@Req() req: any, @Res() res: any) {
    const githubProfile: GithubProfile = req.user;

    return res.redirect("/api/auth/callback/success");
  }

  @Get("callback/success")
  async callbackSuccess() {
    return "callback success!";
  }
}
