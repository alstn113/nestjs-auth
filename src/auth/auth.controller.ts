import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "@/auth/auth.service";
import { AuthDto } from "./dto/auth.dto";
import { Tokens } from "./types/tokens.tpye";
import { GetCurrentUser, GetCurrentUserId, Public } from "@/common/decorators";
import { Response } from "express";
import { RtGuard } from "@/common/guards";

@Controller("/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("/signin/local")
  async signinLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Tokens> {
    const { access_token, refresh_token } = await this.authService.signinLocal(
      dto
    );
    res.cookie("access_token", access_token, {
      maxAge: 1000 * 60 * 15, // 15m
      httpOnly: true,
    });
    res.cookie("refresh_token", refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    });
    return { access_token, refresh_token };
  }

  @Public()
  @Post("/signup/local")
  signupLocal(@Body() dto: AuthDto) {
    return this.authService.signupLocal(dto);
  }

  @Post("/logout")
  async logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(userId);
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
  }

  @Public()
  @UseGuards(RtGuard)
  @Post("/refresh")
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, refresh_token } =
      await this.authService.refreshTokens(userId, refreshToken);
    res.cookie("access_token", access_token, {
      maxAge: 1000 * 60 * 15, // 15m
      httpOnly: true,
    });
    res.cookie("refresh_token", refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    });
    return { access_token, refresh_token };
  }
}
