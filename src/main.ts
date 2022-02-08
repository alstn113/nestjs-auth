import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { setupSwagger } from "./utils/setupSwagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: "http://localhost:3000", // 허용하는 front 주소
  });
  setupSwagger(app);
  const logger = new Logger();
  const configService = app.get(ConfigService);
  const port = configService.get("SERVER_PORT");
  await app.listen(port);
  logger.verbose(`listening on port ${port}`);
}
bootstrap();
