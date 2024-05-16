import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "@superfaceai/passport-twitter-oauth2";
import { TwitterProfile } from "src/common/models/twitter-profile.model";

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("TWITTER_CLIENT_ID", ""),
      clientSecret: configService.get<string>("TWITTER_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("TWITTER_CALLBACK_URL", "http://localhost:3000/api/auth/twitter/callback"),
      scope: ["tweet.read", "users.read", "offline.access"],
      clientType: "confidential",
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

    const { id: twitterId, name, username, profile_image_url: avatar } = profile._json;
    const user: TwitterProfile = {
      id: userIdValue,
      username,
      fullname: name,
      twitterId,
      avatar
    }

    done(null, user);
  }
}