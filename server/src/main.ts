import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configEnvironment } from './environment.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  configEnvironment(app);

  await app.listen(3000);
}
bootstrap();
