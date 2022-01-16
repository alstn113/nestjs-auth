import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";

@Injectable()
export class S3Service {
  s3: S3;
  bucket: string;
  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>("S3_ACCESS_KEY"),
      secretAccessKey: this.configService.get<string>("S3_SECRET_KEY"),
      region: this.configService.get<string>("S3_REGION"),
    });
    this.bucket = this.configService.get<string>("S3_BUCKET");
  }

  pubObject(fileName, data) {
    return this.s3
      .putObject({
        Bucket: this.bucket,
        Key: fileName,
        Body: data.buffer,
      })
      .promise();
  }
}
