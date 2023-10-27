import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";
import { FilesModule } from "./file/file.module";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import { UploadServiceProvider } from "./common/providers/upload/upload.service.provider";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [join(__dirname, "**", "*.entities.{js,ts}")],
      synchronize: false,
      autoLoadEntities: true,
      extra: {
        timezone: "+07:00",
      },
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),

    ScheduleModule.forRoot(),
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
