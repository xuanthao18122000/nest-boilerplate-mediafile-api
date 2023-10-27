import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { getEnv } from "./config/env.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const config = new DocumentBuilder()
    .setTitle("Boilerplate Mediafile API")
    .setDescription("Media Files API description")
    .addServer(getEnv("APP_PUBLIC_ENDPOINT"))
    .setVersion("0.1")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/v1/docs", app, document);
  await app.listen(getEnv("APP_PORT"));
}
bootstrap();
