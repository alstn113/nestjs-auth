import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "@/auth/auth.controller";
import { AuthRepository } from "@/auth/auth.repository";
import { AuthService } from "@/auth/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AtStrategy, RtStrategy } from "@/auth/strategies";

@Module({
  imports: [TypeOrmModule.forFeature([AuthRepository]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
