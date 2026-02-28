// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet())
  app.use(compression())
  app.use(cookieParser())
  // Global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('SignMaster API')
    .setDescription('API untuk aplikasi belajar bahasa isyarat SignMaster')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Levels', 'Learning levels')
    .addTag('Lessons', 'Lessons within levels')
    .addTag('Progress', 'User progress tracking')
    .addTag('Quiz', 'Quiz submission & results')
    .addTag('Achievements', 'User achievements')
    .addTag('Daily Activity', 'Daily activity & streaks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Backend running on: http://localhost:${port}`);
  console.log(`API available at: http://localhost:${port}/api`);
  console.log(`Swagger docs at: http://localhost:${port}/docs`);
}
bootstrap();