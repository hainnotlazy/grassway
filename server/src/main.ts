import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  )
  app.setGlobalPrefix('api');

  /** Config settings for environments */
  if (process.env.NODE_ENV === "production") {
    /** Production environment */ 
    app.enableCors({
      origin: [
        "http://client",
        "https://client"
      ],
      credentials: true,
    });
  } else {
    /** Development environment */ 
    app.enableCors();

    // Config Swagger
    // Swagger will only work on development environment
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Grassway REST API")
      .setDescription("This document lists paths (endpoints) of Grassway")
      .setVersion('1.0.0')
      .addTag("Users", "Endpoints for users interaction")
      .addTag("Auth", "Endpoints for authentication")
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("swagger", app, swaggerDocument); 
  }

  await app.listen(3000);
}
bootstrap();
