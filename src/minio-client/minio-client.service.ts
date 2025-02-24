import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from './config';
import { BufferedFile } from './file.model';
import { Readable } from 'stream';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = config.MINIO_BUCKET;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioClientService');
  }

  // Check and create bucket if it doesn't exist
  private async ensureBucketExists(bucketName: string) {
    try {
      const exists = await this.client.bucketExists(bucketName);
      if (!exists) {
        await this.client.makeBucket(bucketName, 'us-east-1'); // Specify your region if needed
        this.logger.log(`Bucket "${bucketName}" created successfully.`);
      }
    } catch (err) {
      this.logger.error(`Error checking or creating bucket: ${err.message}`);
      throw new HttpException(
        'Error checking or creating bucket',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async upload(
    file: BufferedFile,
    name: string,
    filePath: string,
    baseBucket: string = this.baseBucket,
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException(
        'Only JPEG and PNG files are allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Ensure bucket exists
    await this.ensureBucketExists(baseBucket);

    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'));
    const filename = `${name}${ext}`;

    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': '1234',
    };

    try {
      // Upload the file to MinIO, including filePath
      await this.client.putObject(
        baseBucket,
        `${filePath}/${filename}`,
        file.buffer,
        metaData,
      );
      return {
        filename: filename, // Store this for later use in the download
        url: `${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${baseBucket}/${filePath}/${filename}`,
      };
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`);
      throw new HttpException(
        'Error uploading file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async downloadFile(
    filename: string, // The filename to download
    filePath: string, // The file path in the bucket
    baseBucket: string = this.baseBucket,
  ) {
    try {
      this.logger.log(
        `Attempting to download: ${filename} from path: ${filePath} in bucket: ${baseBucket}`,
      );

      // Fetch the file from MinIO
      const dataStream = await this.client.getObject(
        baseBucket,
        `${filePath}/${filename}`,
      );
      return dataStream;
    } catch (err) {
      this.logger.error(`Error downloading file: ${err.message}`);
      throw new HttpException(
        `Error downloading file: ${err.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getObjectsInFolder(
    folderPath: string, // The folder path in the bucket
    baseBucket: string = this.baseBucket,
  ): Promise<{ filename: string; stream: Readable }[]> {
    try {
      // Ensure bucket exists
      await this.ensureBucketExists(baseBucket);

      // List objects in the specified folder
      const objects = await this.client.listObjects(
        baseBucket,
        folderPath,
        true,
      ); // Recursive listing

      const fileStreams: { filename: string; stream: Readable }[] = [];

      for await (const obj of objects) {
        if (obj.prefix || obj.size === 0) {
          // Skip folders and empty objects
          continue;
        }

        const filename = obj.name.substring(folderPath.length); // Remove folder prefix

        // Get object stream
        const dataStream = await this.client.getObject(baseBucket, obj.name);

        fileStreams.push({ filename, stream: dataStream });
      }

      return fileStreams;
    } catch (err) {
      this.logger.error(`Error listing objects in folder: ${err.message}`);
      throw new HttpException(
        `Error listing objects in folder: ${err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async delete(
    filename: string, // The filename to delete
    filePath: string, // The file path in the bucket
    baseBucket: string = this.baseBucket,
  ) {
    try {
      // Ensure bucket exists before deleting
      await this.ensureBucketExists(baseBucket);

      // Remove the file from MinIO
      await this.client.removeObject(baseBucket, `${filePath}/${filename}`);
    } catch (err) {
      this.logger.error(`Error deleting file: ${err.message}`);
      throw new HttpException(
        'Error deleting file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUrl(
    filePath: string,
    baseBucket: string = config.MINIO_BUCKET,
  ): Promise<string> {
    try {
      const url = await this.generatePresignedUrl(baseBucket, filePath);
      return url; // Returns a signed URL valid for 24 hours
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  public async generatePresignedUrl(
    bucketName: string,
    objectName: string,
    expirySeconds: number = 3600, // Default expiry time is 1 hour
  ): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(
        bucketName,
        objectName,
        expirySeconds,
      );
      return url;
    } catch (err) {
      this.logger.error(`Error generating presigned URL: ${err.message}`);
      throw new HttpException(
        'Error generating presigned URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
