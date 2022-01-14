import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AtGuard } from "@/common/guards";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  const reflector = new Reflector();
  app.useGlobalGuards(new AtGuard(reflector));
  app.enableCors({
    credentials: true,
    origin: "http://localhost:3000", // 허용하는 front 주소
  });
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const port = configService.get("SERVER_PORT");
  await app.listen(port);
  logger.verbose(`listening on port ${port}`);
}
bootstrap();
