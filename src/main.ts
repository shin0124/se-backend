import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT; // ใช้ environment variable สำหรับ port
  const frontendUrl = process.env.FRONTEND_URL; // URL ของ Frontend

  logger.log(`Starting application...`);

  const app = await NestFactory.create(AppModule);
  // app.use(bodyParser.json({ limit: '50mb' }));
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // app.use('/images', (req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', frontendUrl); // Ensure the frontend URL is allowed
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Content-Type, X-Citizen-ID, X-Role, X-Token',
  //   );
  //   next();
  // });

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
