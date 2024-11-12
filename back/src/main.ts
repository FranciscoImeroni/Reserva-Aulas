import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';  // Importación corregida

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  // Permite que se transformen los objetos según el DTO
    whitelist: true,  // Elimina propiedades no especificadas en el DTO
  }));
  app.use(cookieParser());  // Usa cookie-parser como middleware
  await app.listen(3000);
  console.log("App listening on port 3000");
}
bootstrap();
