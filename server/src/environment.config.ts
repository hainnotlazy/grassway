import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";

export function configEnvironment(app: INestApplication) {
  app.use(helmet());
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
}