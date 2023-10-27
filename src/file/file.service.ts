import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Mediafile } from "src/database/entities";
import * as mimeTypes from "mime-types";
import { MediafileEnum } from "src/common/constants/user.constant";
import * as AWS from "aws-sdk";
import * as Minio from "minio";
import * as crypto from "crypto";
import { MediaFileInterface } from "src/common/interfaces/mediafile-variants.interface";
import { getEnv } from "src/config/env.config";
import * as sharp from "sharp";
import { UploadServiceProvider } from "src/common/providers/upload/upload.service.provider";

@Injectable()
export class MediaFilesService {
  constructor(
    @InjectRepository(Mediafile)
    private fileRepository: Repository<Mediafile>,
    @Inject("UploadService")
    private readonly uploadService: UploadServiceProvider
  ) {}
  async create() {}
  async getList() {
    const files = await this.fileRepository.findAndCount();
    return files;
  }

  buildMediafile(file: Express.Multer.File) {
    const id = crypto.randomUUID();
    const extension = mimeTypes.extension(file.mimetype);
    const result = {
      id,
      extension,
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      status: MediafileEnum.STATUS.ACTIVE,
      type: MediafileEnum.TYPE.GLOBAL,
    };
    return result;
  }
  async uploadS3(buffer: Buffer, keyName: string, contentType: string) {
    const BUCKET = getEnv("OBJECT_STORAGE_BUCKET");
    const ACCESS_KEY = getEnv("OBJECT_STORAGE_ACCESS_KEY");
    const SECRET_KEY = getEnv("OBJECT_STORAGE_SECRET_KEY");

    const s3 = new AWS.S3({
      secretAccessKey: SECRET_KEY,
      accessKeyId: ACCESS_KEY,
    });

    s3.listBuckets()
      .promise()
      .then((data) => console.log(data));

    const metaData = {
      "Content-Type": contentType,
    };

    try {
      const data = await s3
        .upload({
          Bucket: BUCKET,
          Key: keyName,
          Body: buffer,
          Metadata: metaData,
          // ACL: 'public-read',
        })
        .promise();

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async uploadMinio(buffer: Buffer, keyName: string, contentType: string) {
    const BUCKET = getEnv("OBJECT_STORAGE_BUCKET");
    const ENDPOINT = getEnv("OBJECT_STORAGE_ENDPOINT");
    const ACCESS_KEY = getEnv("OBJECT_STORAGE_ACCESS_KEY");
    const SECRET_KEY = getEnv("OBJECT_STORAGE_SECRET_KEY");
    const MINIO_PORT = getEnv("OBJECT_STORAGE_PORT", Number);
    const MINIO_USE_SSL = getEnv("OBJECT_STORAGE_USE_SSL");

    const minioClient = new Minio.Client({
      endPoint: ENDPOINT,
      port: MINIO_PORT,
      useSSL: MINIO_USE_SSL === "true" ? true : false, // Set to true if you are using SSL/TLS
      accessKey: ACCESS_KEY,
      secretKey: SECRET_KEY,
    });

    minioClient.listBuckets().then((data) => console.log(data));
    const metaData = {
      "Content-Type": contentType,
    };

    try {
      const data = await minioClient.putObject(
        BUCKET,
        keyName,
        buffer,
        metaData
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  upload(buffer: Buffer, keyName: string, contentType: string) {
    const OBJECT_STORAGE_TYPE = getEnv("OBJECT_STORAGE_TYPE");

    if (OBJECT_STORAGE_TYPE == "AWS") {
      this.uploadS3(buffer, keyName, contentType);
    } else {
      this.uploadMinio(buffer, keyName, contentType);
    }
  }
  async buildUpload(input: MediaFileInterface, file: Express.Multer.File) {
    try {
      await this.uploadService.uploadFile(
        file.buffer,
        `${input.id}.${input.extension}`,
        input.mimeType
      );
    } catch (error) {
      throw error;
    }

    if (input.variants) {
      let variantBuffer: Buffer;
      for (const variant in input.variants) {
        if (variant === "thumbnail") {
          variantBuffer = await this.resizeImage(
            file.buffer,
            [MediafileEnum.SIZES.THUMP, MediafileEnum.SIZES.THUMP],
            true
          );
        } else {
          variantBuffer = await this.resizeImage(file.buffer, Number(variant));
        }
        input.variants[variant].size = Buffer.byteLength(variantBuffer);

        this.uploadService.uploadFile(
          variantBuffer,
          `${input.variants[variant].id}.${input.extension}`,
          input.mimeType
        );
      }
    }

    return input;
  }
  async resizeImage(
    buffer: Buffer,
    resolution: number | Array<number>,
    isThump?: boolean
  ) {
    let targetObject = sharp(buffer);
    if (isThump) {
      targetObject = targetObject.resize(resolution[0], resolution[1]);
    } else {
      targetObject = targetObject.resize(Number(resolution));
    }
    return await targetObject.toBuffer();
  }
  buildImageVariants() {
    const result = {};
    for (const size of MediafileEnum.SIZES.RESOLUTIONS) {
      const id = crypto.randomUUID();
      result[size] = { id };
    }

    return result;
  }
  async saveToDatabase(input: MediaFileInterface) {
    await this.fileRepository.save(input);
  }
}
