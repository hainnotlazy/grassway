import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/modules/users/users.service";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>("JWT_SECRET", "do-not-public-this-secret-key"),
      passReqToCallback: true,
    })
  }

  async validate(request: any, payload: any) {
    const accessToken = request.headers.authorization.split(" ")[1];
    const { userId, exp: expirationTime } = payload;

    // Find user from token
    const user =  await this.usersService.findUser(userId);

    // Validate user
    if (!user.is_active) {
      throw new ForbiddenException("Account is inactive");
    } else if (await this.authService.isTokenBlacklisted(accessToken)) {
      throw new UnauthorizedException("Token is invalid");
    }

    request.expirationTime = expirationTime;
    return user;
  }
}