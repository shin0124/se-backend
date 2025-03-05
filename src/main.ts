import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT; // ใช้ environment variable สำหรับ port
  const frontendUrl = process.env.FRONTEND_URL; // URL ของ Frontend

  logger.log(`Starting application...`);

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: 'Content-Type, X-Citizen-ID, X-Role, X-Token',
    credentials: true,
  });

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
