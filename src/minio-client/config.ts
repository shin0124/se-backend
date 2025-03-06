import 'dotenv/config';

export const minioConfig = {
  endPoint: 'localhost', // The MinIO service is running locally
  port: 9000, // MinIO port exposed in your Docker setup
  useSSL: false, // Use SSL if configured in your MinIO service
  accessKey: 'SE-DIARY-MINIO',
  secretKey: 'XESDTPLHVTDDDFGGJKKNGVCGUJK', // MinIO root password
  bucket: 'image',
};
