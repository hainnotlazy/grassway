import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-facebook";
import { FacebookProfile } from "src/common/models/facebook-profile.model";

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("FACEBOOK_CLIENT_ID", ""),
      clientSecret: configService.get<string>("FACEBOOK_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("FACEBOOK_CALLBACK_URL", "http://localhost:3000/api/auth/facebook/callback"),
      scope: ["public_profile", "email"],
      profileFields: ["id", "displayName", "photos", "email", "name"],
      passReqToCallback: true
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

    const { name, id: facebookId, email, picture } = profile._json;
    const user: FacebookProfile = {
      id: userIdValue,
      facebookId,
      fullname: name,
      avatar: picture.data.url,
    }

    done(null, user);
  }
}