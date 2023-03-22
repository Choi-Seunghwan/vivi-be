import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class StorageService {
  logger = new Logger(StorageService.name);
  private s3: S3;
  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: configService.get('STORAGE_S3_AWS_REGIN'),
      credentials: {
        accessKeyId: configService.get('STORAGE_S3_AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('STORAGE_S3_AWS_SECRET_KEY'),
      },
    });
  }

  async uploadToS3(file: Express.Multer.File, path: string = 'upload'): Promise<string> {
    try {
      const { buffer, mimetype, originalname } = file;
      const uuidStr = uuidV4();
      const bucket = this.configService.get('STORAGE_S3_AWS_BUCKET');
      const uploadParams: S3.PutObjectRequest = {
        Bucket: bucket,
        Key: `${path}/${originalname}-${uuidStr}`,
        Body: buffer,
        ContentType: mimetype,
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (e) {
      throw e;
    }
  }
}
