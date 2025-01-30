import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 1234; // ใช้ environment variable สำหรับ port
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'; // URL ของ Frontend

  logger.log(`Starting application...`);

  const app = await NestFactory.create(AppModule);

  // ตั้งค่า CORS
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
