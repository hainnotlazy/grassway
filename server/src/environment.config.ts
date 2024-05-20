import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import * as session from 'express-session';
import { config } from "dotenv";

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`
});

export function configEnvironment(app: INestApplication) {
  app.use(helmet());
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'grassway-session-secret',
      resave: false,
      saveUninitialized: true,
    }),
  );
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
      .addTag("Urls", "Endpoints for urls interaction")
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("swagger", app, swaggerDocument); 
  }
}