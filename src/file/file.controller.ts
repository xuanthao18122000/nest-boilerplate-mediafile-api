import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, ParseFilePipeBuilder, UploadedFiles } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { MediaFilesService } from "./file.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MediaFileInterface } from "src/common/interfaces/mediafile-variants.interface";
import { getEnv } from "src/config/env.config";

@Controller("files")
@ApiBearerAuth()
@ApiTags("Files")
export class MediaFilesController {
  constructor(private readonly mediaFilesService: MediaFilesService) {}

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: 100 * 1024 * 1024 })
        .build({
          fileIsRequired: true,
        })
    ) file: Express.Multer.File
  ) {
    let input: MediaFileInterface = this.mediaFilesService.buildMediafile(file);

    if (input.mimeType.includes("image")) {
      input.variants = this.mediaFilesService.buildImageVariants();
    }

    try {
      input = await this.mediaFilesService.buildUpload(input, file);
      await this.mediaFilesService.saveToDatabase(input);

      const fileLink = `${getEnv("FILE_CDN_URL")}/${input.id}.${input.extension}`;
      console.log(`🚀 File uploaded successfully: ${fileLink} 🚀`);

      return {
        link: fileLink,
        fileUpload: `${input.id}.${input.extension}`,
        ...input,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post("uploads")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: { type: "string", format: "binary" },
          description: "Array of files to be uploaded",
        },
      },
    },
  })
  @UseInterceptors(
    FilesInterceptor("files", 20),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedFiles = [];

    for (const file of files) {
      let input: MediaFileInterface = this.mediaFilesService.buildMediafile(file);

      if (input.mimeType.includes("image")) {
        input.variants = this.mediaFilesService.buildImageVariants();
      }

      try {
        input = await this.mediaFilesService.buildUpload(input, file);
        await this.mediaFilesService.saveToDatabase(input);

        const fileLink = `${getEnv("FILE_CDN_URL")}/${input.id}.${input.extension}`;
        console.log(`🚀 File uploaded successfully: ${fileLink} 🚀`);
        uploadedFiles.push({
          link: fileLink,
          fileUpload: `${input.id}.${input.extension}`,
          ...input,
        });
      } catch (error) {
        throw error;
      }
    }

    return uploadedFiles;
  }
}
