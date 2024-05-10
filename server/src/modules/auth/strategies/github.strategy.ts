import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-github2";
import { GithubProfile } from "src/common/models/github-profile.model";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("GITHUB_CLIENT_ID", ""),
      clientSecret: configService.get<string>("GITHUB_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("GITHUB_CALLBACK_URL", "http://localhost:3000/api/auth/github/callback"),
      passReqToCallback: true,
    })
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: any) {
    const rawHeaders = request.rawHeaders;

    const { avatar_url, html_url, name, login } = profile._json;
    const user: GithubProfile = {
      id: null,
      username: login,
      fullname: name,
      github: html_url,
      avatar: avatar_url
    }

    done(null, user);
  }
}