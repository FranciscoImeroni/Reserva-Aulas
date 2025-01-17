import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';  
import * as dotenv from 'dotenv';  

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  
    whitelist: true, 
  }));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.DOMAIN_FRONT, 
    credentials: true,             
  });
  await app.listen(3000);
  console.log("App listening on port 3000");
}

bootstrap();

//LOCALTUNNEL
/* import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    transform: true,  
    whitelist: true, 
  }));

  // Usar cookie-parser
  app.use(cookieParser());

  // Configuración de CORS
  const allowedOrigins = [
    process.env.DOMAIN_FRONT || 'http://localhost:4000', // URL local
    'https://puny-shirts-poke.loca.lt'                 // URL Localtunnel
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`CORS error: Origin ${origin} not allowed.`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Permitir envío de cookies
  });

  await app.listen(3000);
  console.log('App listening on port 3000');
}

bootstrap();
 */