import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload, JwtPayloadWithRt } from "../types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false, // default
      secretOrKey: configService.get<string>("auth.refresh_token_secret"),
      passReqToCallback: true, // req에 접근이 가능하게 되어 passport인증 시 밑에서 사용됨
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req?.cookies?.refresh_token;

    if (!refreshToken) throw new ForbiddenException("Refresh token malformed");
    return {
      ...payload,
      refreshToken,
    };
  }
  // 이 부분을 왜 이렇게 했냐면 /auth/refresh 할 때 get-current-user decorator에서 refresh-token을 받아와야함
  // 그 다음 refresh토큰과 hashed토큰을 비교해서 refresh해줌
}
