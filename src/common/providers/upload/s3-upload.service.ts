import { Injectable } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { getEnv } from "src/config/env.config";

@Injectable()
export class S3UploadService {
  private readonly s3Client: AWS.S3;
  private BUCKET = getEnv("OBJECT_STORAGE_BUCKET");
  private ACCESS_KEY = getEnv("OBJECT_STORAGE_ACCESS_KEY");
  private SECRET_KEY = getEnv("OBJECT_STORAGE_SECRET_KEY");
  constructor() {
    this.s3Client = new AWS.S3({
      accessKeyId: this.ACCESS_KEY,
      secretAccessKey: this.SECRET_KEY,
    });
    this.s3Client
      .listBuckets()
      .promise()
      .then((data) => console.log(data));
  }

  async uploadFile(buffer: Buffer, keyName: string, contentType: string) {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.BUCKET,
      Key: keyName,
      Body: buffer,
      ContentType: contentType,
    };

    try {
      await this.s3Client.putObject(params).promise(); // Upload the file to AWS S3
      return { message: "File uploaded successfully to AWS S3!" };
    } catch (error) {
      console.error("Error uploading file to AWS S3:", error);
      throw new Error("Failed to upload file to AWS S3");
    }
  }
}
