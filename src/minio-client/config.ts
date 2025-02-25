export const minioConfig = {
  endPoint: 'localhost', // The MinIO service is running locally
  port: 9000, // MinIO port exposed in your Docker setup
  useSSL: false, // Use SSL if configured in your MinIO service
  accessKey: 'AKIAIOSFODNN7EXAMPLE', // MinIO root user
  secretKey: 'wJalrXUtnFEMIK7MDENGbPxRfiCYEXAMPLEKEY', // MinIO root password
  bucket: 'image',
};
