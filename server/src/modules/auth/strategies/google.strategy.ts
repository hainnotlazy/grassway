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
    let refLinksRaw = requestRawHeaders.find(header => header.includes("refLinks="));
    let userIdRaw: string | undefined = requestRawHeaders.find(header => header.includes("userId="));

    // Handle to get userId cookie if more than 1 cookie existing
    if (userIdRaw) {
      userIdRaw = userIdRaw.split(";")
        .find(param => param.includes("userId="));
      request.res.clearCookie("userId");
    } else if (refLinksRaw) {
      refLinksRaw = refLinksRaw.split(";")
        .find(param => param.includes("refLinks="));
      request.res.clearCookie("refLinks");
    }
    const userId = userIdRaw?.split("=")[1] || null;
    const refLinks: string[] = refLinksRaw 
      ? JSON.parse(decodeURIComponent(refLinksRaw.split("=")[1])) 
      : [];

    const { name, picture, email } = profile._json;
    
    // Increase picture size
    const pictureIncreasedSize = picture.replace("=s96-c", "=s500-c");
    
    const user: GoogleProfile = {
      id: userId,
      fullname: name,
      email,
      avatar: pictureIncreasedSize,
      refLinks
    }

    done(null, user);
  }
}