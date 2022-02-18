import { JwtPayload } from "@/auth/types";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUserId = createParamDecorator(
  (_data: undefined, context: ExecutionContext): number => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtPayload;
    return user.userId;
    //jwt guard 지나오고 req.user에 정보 담겨있음
  }
);
