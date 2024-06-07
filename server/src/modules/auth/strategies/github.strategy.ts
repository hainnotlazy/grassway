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
    let refLinksRaw = requestRawHeaders.find(header => header.includes("refLinks="));
    let userIdRaw: string | undefined = requestRawHeaders.find(header => header.includes("userId="));

    // Handle to get userId cookie if more than 1 cookie existing
    if (userIdRaw) {
      userIdRaw = userIdRaw.split(";")
        .find(param => param.includes("userId="));
      request.res.clearCookie("userId");
    } else {
      refLinksRaw = refLinksRaw.split(";")
        .find(param => param.includes("refLinks="));
        request.res.clearCookie("refLinks");
      }
    const userId = userIdRaw?.split("=")[1] || null;
    const refLinks: string[] = refLinksRaw 
      ? JSON.parse(decodeURIComponent(refLinksRaw.split("=")[1])) 
      : [];

    const { avatar_url, html_url, name, login } = profile._json;
    const user: GithubProfile = {
      id: userId,
      username: login,
      fullname: name,
      github: html_url,
      avatar: avatar_url,
      refLinks
    }

    done(null, user);
  }
}