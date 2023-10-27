import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

// import FilterableService from '../../share/filter.service';
import { Mediafile } from "src/database/entities";
import { MediaFilesController } from "./file.controller";
import { MediaFilesService } from "./file.service";
import { UploadServiceProvider } from "src/common/providers/upload/upload.service.provider";

@Module({
  imports: [
    TypeOrmModule.forFeature([Mediafile]),
    UploadServiceProvider.forRoot(),
  ],

  controllers: [MediaFilesController],
  providers: [MediaFilesService, UploadServiceProvider],
})
export class FilesModule {}
