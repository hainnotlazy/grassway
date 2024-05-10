import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateLogin(username, password);
    
    if (!user) {
      throw new UnauthorizedException();
    } else if (!user.is_active) {
      throw new ForbiddenException("Account is inactive");
    }

    return user;
  }
}