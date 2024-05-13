import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { ConfigService } from "@nestjs/config";
import { GoogleProfile } from "src/common/models/google-profile.model";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID", ""),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET", ""),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL", "http://localhost:3000/api/auth/google/callback"),
      scope: ["profile", "email"],
      passReqToCallback: true
    })
  }

  async validate(request: any, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    const requestRawHeaders = request.rawHeaders;
    let userId = requestRawHeaders.find(header => header.includes("userId="));
    // Handle to get userId cookie if more than 1 cookie existing
    if (userId) {
      userId = userId.slice(userId.indexOf("userId="));
    }
    const userIdValue = userId?.split("=")[1] || null;
    request.res.clearCookie("userId");

    const { name, picture, email } = profile._json;
    
    // Increase picture size
    const pictureIncreasedSize = picture.replace("=s96-c", "=s500-c");
    
    const user: GoogleProfile = {
      id: userIdValue,
      fullname: name,
      email,
      avatar: pictureIncreasedSize
    }

    done(null, user);
  }
}