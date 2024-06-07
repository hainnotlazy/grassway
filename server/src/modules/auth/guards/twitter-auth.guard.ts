import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class TwitterAuthGuard extends AuthGuard("twitter") { 

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const refLinks = request.query.refLinks;
    const userId = request.query.userId;

    // Handle when user register with ref links
    if (refLinks) {
      response.cookie("refLinks", JSON.stringify(refLinks), { 
        expires: new Date(Date.now() + 5 * 60 * 1000) 
      });
    }

    // Handle when user authenticating via twitter to link account
    if (userId) {
      response.cookie("userId", userId, { 
        expires: new Date(Date.now() + 5 * 60 * 1000) 
      });
    }
    return super.canActivate(context);
  }
}