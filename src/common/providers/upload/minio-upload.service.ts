import { Injectable } from "@nestjs/common";
import * as Minio from "minio";
import { getEnv } from "src/config/env.config";

@Injectable()
export class MinioUploadService {
  private readonly minioClient: Minio.Client;
  private BUCKET: string = getEnv("OBJECT_STORAGE_BUCKET");
  private ENDPOINT: string = getEnv("OBJECT_STORAGE_ENDPOINT");
  private ACCESS_KEY: string = getEnv("OBJECT_STORAGE_ACCESS_KEY");
  private SECRET_KEY: string = getEnv("OBJECT_STORAGE_SECRET_KEY");
  private MINIO_PORT: number = getEnv("OBJECT_STORAGE_PORT", Number);
  private MINIO_USE_SSL: string = getEnv("OBJECT_STORAGE_USE_SSL");
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: this.ENDPOINT,
      port: this.MINIO_PORT,
      useSSL: this.MINIO_USE_SSL == "true" ? true : false,
      accessKey: this.ACCESS_KEY,
      secretKey: this.SECRET_KEY,
    });
    // this.minioClient.listBuckets().then((data) => console.log(data));
  }

  async uploadFile(buffer: Buffer, keyName: string, contentType: string) {
    const metaData = {
      "Content-Type": contentType,
    };
    try {
      const data = await this.minioClient.putObject(
        this.BUCKET,
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
}
