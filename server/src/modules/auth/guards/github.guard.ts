import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GithubAuthGuard extends AuthGuard("github") { 

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const userId = request.query.userId;

    // Handle when user authenticating via github to link account
    if (userId) {
      response.cookie("userId", userId, { 
        expires: new Date(Date.now() + 5 * 60 * 1000) 
      });
    }
    return super.canActivate(context);
  }
}