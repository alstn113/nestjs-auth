import { HttpException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthRepository } from "./auth.repository";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Tokens } from "@/auth/types/tokens.tpye";
import { IsNull, Not } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private configService: ConfigService,
    private jwtService: JwtService
  ) {}

  async signinLocal(dto: AuthDto): Promise<Tokens> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) throw new HttpException("없어요 없어 하하!", 404);
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new HttpException("없어요 없어 하하!", 404);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signupLocal(dto: AuthDto) {
    dto.password = await this.hashData(dto.password);
    await this.authRepository.createUser(dto);
  }

  async logout(userId: number) {
    const user = await this.authRepository.findOne({
      where: {
        id: userId,
        hashedRt: Not(IsNull()),
      },
    });
    await this.authRepository.save({ ...user, hashedRt: null });
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.authRepository.findUserById(userId);
    if (!user || !user.hashedRt) throw new HttpException("접근 금지", 404);
    const rtmatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtmatches) throw new HttpException("접근 금지", 404);

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          userId,
          email,
          sub: "access_token",
        },
        {
          secret: this.configService.get<string>("auth.access_token_secret"),
          expiresIn: "15m",
        }
      ),
      this.jwtService.signAsync(
        {
          userId,
          email,
          sub: "refresh_token",
        },
        {
          secret: this.configService.get<string>("auth.refresh_token_secret"),
          expiresIn: "7d",
        }
      ),
    ]);
    return { access_token, refresh_token };
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.authRepository.update({ id: userId }, { hashedRt: hash });
  }
}
