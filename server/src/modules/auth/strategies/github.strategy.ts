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
    const requestRawHeaders = request.rawHeaders;
    let userId = requestRawHeaders.find(header => header.includes("userId="));
    // Handle to get userId cookie if more than 1 cookie existing
    if (userId) {
      userId = userId.slice(userId.indexOf("userId="));
    }
    const userIdValue = userId?.split("=")[1] || null;
    request.res.clearCookie("userId");

    const { avatar_url, html_url, name, login } = profile._json;
    const user: GithubProfile = {
      id: userIdValue,
      username: login,
      fullname: name,
      github: html_url,
      avatar: avatar_url
    }

    done(null, user);
  }
}