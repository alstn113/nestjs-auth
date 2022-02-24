import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "@/auth/auth.service";
import { AuthDto } from "./dto/auth.dto";
import { Tokens } from "./types/tokens.type";
import { GetCurrentUser, GetCurrentUserId, Public } from "@/common/decorators";
import { Response } from "express";
import { RtGuard } from "@/common/guards";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

//TODO: 경로들의 타입 다시 고치기
//TODO: swagger 정확하기 고치기

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signin/local")
  @ApiOperation({ summary: "local 로그인", description: "local로 로그인함" })
  async signinLocal(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<Tokens> {
    const { access_token, refresh_token } = await this.authService.signinLocal(
      dto
    );
    res.cookie("access_token", access_token, {
      maxAge: 1000 * 60 * 60 * 1, // 1h
      //maxAge: 1000 * 5, // 5s
      httpOnly: true,
    });
    res.cookie("refresh_token", refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    });
    return { access_token, refresh_token };
  }

  @Public()
  @Post("signup/local")
  @ApiOperation({
    summary: "local 회원가입",
    description: "local로 회원가입함",
  })
  signupLocal(@Body() dto: AuthDto) {
    return this.authService.signupLocal(dto);
  }

  @Post("logout")
  @ApiOperation({
    summary: "로그아웃",
    description: "로그아웃하고 토큰을 삭제",
  })
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
  @Post("refresh")
  @ApiOperation({
    summary: "token 갱신",
    description: "refresh토큰으로 access토큰과 refresh토큰 갱신",
  })
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser("refreshToken") refreshToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, refresh_token } =
      await this.authService.refreshTokens(userId, refreshToken);
    res.cookie("access_token", access_token, {
      maxAge: 1000 * 60 * 60 * 1, // 1h
      //maxAge: 1000 * 5, // 5s
      httpOnly: true,
    });
    res.cookie("refresh_token", refresh_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
      httpOnly: true,
    });
    return { access_token, refresh_token };
  }
  // 테스트용
  @Get("/")
  async findUsers() {
    return this.authService.findUsers();
  }
}
