import 'dotenv/config';

export const minioConfig = {
  endPoint: process.env.MINIO_ENDPOINT, // The MinIO service is running locally
  port: parseInt(process.env.MINIO_PORT), // MinIO port exposed in your Docker setup
  useSSL: false, // Use SSL if configured in your MinIO service
  accessKey: process.env.MINIO_ACCESS_KEY, // MinIO root user
  secretKey: process.env.XESDTPLHVTDDDFGGJKKNGVCGUJK, // MinIO root password
  bucket: process.env.MINIO_BUCKET,
};
