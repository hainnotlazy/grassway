import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const TokenExpirationTime = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.expirationTime;
  }
)