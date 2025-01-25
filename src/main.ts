import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap'); // Create a Logger instance
  logger.log(`start`); // Log the message
  const app = await NestFactory.create(AppModule);
  logger.log(`porting`); // Log the message
  await app.listen(process.env.PORT ?? 1234);
  logger.log(`Application is running on: http://localhost:${1234}`); // Log the message
}
bootstrap();
