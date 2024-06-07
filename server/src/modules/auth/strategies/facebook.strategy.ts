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

    const { name, id: facebookId, email, picture } = profile._json;
    const user: FacebookProfile = {
      id: userId,
      facebookId,
      fullname: name,
      avatar: picture.data.url,
      refLinks
    }

    done(null, user);
  }
}